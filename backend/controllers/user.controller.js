import User from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../middlewares/cloudinary.js";
import Otp from "../models/otp.model.js";
import { transporter, sendEmail } from "../utilities/transporter.js";
import fs from "fs";
import { promisify } from "util";
import generateOtp from "../utilities/generateOtp.js";
import mongoose from "mongoose";
import { execSync } from "child_process";

const unlinkAsync = promisify(fs.unlink);

function isValidRollNo(rollNo) {
  const pattern = /^(\d{2})(cse|ee|me|ce|dee|dme|dcse|dce|bca|bba)(\d{1,3})$/i;
  return pattern.test(rollNo);
}

const sendOtpViaEmail = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { username, fullName, email, password, rollNo, gender } = req.body;
    if (!username || !fullName || !email || !password || !rollNo || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    if (!isValidRollNo(rollNo)) {
      return res.status(400).json({ message: "Invalid roll number format" });
    }
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email }, { rollNo: rollNo }, { username: username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email, roll number or username already exists",
      });
    }
    let url = "";
    let public_id = "";

    const file = req.file;
    if (file) {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
        // Clean up uploaded file if validation fails
        if (file.path) {
          try {
            await unlinkAsync(file.path);
          } catch (cleanupError) {
            console.error("Error cleaning up invalid file:", cleanupError);
          }
        }
        return res.status(400).json({ message: "Invalid image format" });
      }

      try {
        console.log("Uploading file to Cloudinary:", file.path);
        const uploadResult = await uploadOnCloudinary(file.path);
        url = uploadResult.url;
        public_id = uploadResult.public_id;

        if (!url || !public_id) {
          return res.status(400).json({ message: "Image upload failed" });
        }

        // Clean up temporary file after successful upload
        if (file.path) {
          try {
            await unlinkAsync(file.path);
          } catch (cleanupError) {
            console.error("Error cleaning up temporary file:", cleanupError);
            // Don't fail the request if cleanup fails
          }
        }
      } catch (uploadError) {
        // Clean up temporary file if upload fails
        if (file.path) {
          try {
            await unlinkAsync(file.path);
          } catch (cleanupError) {
            console.error(
              "Error cleaning up file after upload failure:",
              cleanupError
            );
          }
        }
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    session.startTransaction();

    const newUser = await User.create(
      [
        {
          username,
          fullName,
          email,
          password,
          rollNo,
          gender,
          profilePicture: {
            url: url,
            public_id: public_id,
          },
        },
      ],
      { session }
    );
    if (!newUser) {
      await session.abortTransaction();
      return res.status(500).json({ message: "User creation failed" });
    }
    //now generate OTP
    const otp = generateOtp();
    if (!otp) {
      await session.abortTransaction();
      return res.status(500).json({ message: "OTP generation failed" });
    }
    const otpInstance = await Otp.create(
      [
        {
          userId: newUser[0]._id,
          purpose: "email-verification",
          otpExpiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
          otp: otp,
          otpAttempts: 0,
          resendAfter: Date.now() + 60 * 1000 * 2, // 2 minutes from now
        },
      ],
      { session }
    );
    // Here you would send the OTP to the user's email
    if (!otpInstance || otpInstance.length === 0) {
      await session.abortTransaction();
      return res.status(500).json({ message: "OTP creation failed" });
    }
    try {
      await otpInstance[0].sendOtpViaEmail(email, otp);
    } catch (error) {
      console.error("Error sending OTP email:", error);
      await session.abortTransaction();
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    await session.commitTransaction();

    return res.status(200).json({
      message: `OTP sent to your email ${email}.`,
      email: email,
    });
  } catch (error) {
    console.error("Error in sendOtpViaEmail:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otpInstance = await Otp.findOne({
      userId: user._id,
      purpose: "email-verification",
    });
    if (!otpInstance) {
      return res.status(404).json({ message: "OTP not found" });
    }
    if (otpInstance.hasExceededMaxAttempts()) {
      return res.status(400).json({
        message: "Maximum OTP attempts exceeded. Please request a new OTP.",
      });
    }
    const isValid = otpInstance.isOtpValid(otp);
    if (!isValid) {
      await otpInstance.save();
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    // OTP is valid, proceed with verification
    await User.updateOne({ _id: user._id }, { isEmailVerified: true });
    await otpInstance.removeInstance();
    await sendEmail(
      email,
      "Email Verified",
      `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2196F3;">Email Verified</h2>
      <p>Dear User,</p>
      <p>Your email has been <strong>successfully verified</strong>.</p>
      <p>It has been forwarded to the admin for final account verification.</p>
      <p>You will receive another confirmation once your account is fully verified.</p>
      <p style="margin-top: 30px;">Thank you,<br>The Team</p>
    </div>
  `
    );

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error in verifyOtp" });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpInstance = await Otp.findOne({
      userId: user._id,
      purpose: "email-verification",
    });

    const newOtp = generateOtp();
    const otpExpires = Date.now() + 5 * 60 * 1000;
    const nextResendAllowed = Date.now() + 2 * 60 * 1000;

    if (otpInstance) {
      let currentTime = Date.now();
      if (otpInstance.resendAfter > currentTime) {
        return res.status(400).json({
          message: `You can request new OTP after ${new Date(
            otpInstance.resendAfter
          ).toLocaleTimeString()}`,
        });
      }

      otpInstance.otp = newOtp;
      otpInstance.otpExpiresAt = otpExpires;
      otpInstance.resendAfter = nextResendAllowed;
      otpInstance.otpAttempts = 0; // Reset attempts when new OTP is generated

      await otpInstance.save();

      try {
        await otpInstance.sendOtpViaEmail(transporter, email, newOtp);
        return res.status(200).json({ message: "OTP resent successfully" });
      } catch (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
    } else {
      const newOtpInstance = await Otp.create({
        userId: user._id,
        purpose: "email-verification",
        otpExpiresAt: otpExpires,
        otp: newOtp,
        otpAttempts: 0,
        resendAfter: nextResendAllowed,
      });

      try {
        await newOtpInstance.sendOtpViaEmail(transporter, email, newOtp);
      } catch (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
    }

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("error in resendOtp:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error in resendOtp" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email && !username) {
      return res.status(400).json({ message: "Email or username is required" });
    }

    const query = email ? { email } : { username };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const accessToken = await user.generateAccessToken();
    if (!accessToken) {
      return res
        .status(500)
        .json({ message: "Failed to generate access token" });
    }
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        isAdminVerified: user.isAdminVerified,
        bio: user.bio,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        rollNo: user.rollNo,
        gender: user.gender,
        popularity: user.popularity,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error in loginUser" });
  }
};

const logOutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Err while logging out user:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // Assuming user is set by verifyUser middleware
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({
      message: "Current user fetched successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error in getCurrentUser:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error in getCurrentUser" });
  }
};

const updateTextDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let incomingData = req.body;
    const allowedProperty = ["username", "fullName"];

    if (!incomingData || Object.keys(incomingData).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    let isModified = false;

    for (let key of allowedProperty) {
      if (incomingData[key] !== undefined && user[key] !== incomingData[key]) {
        user[key] = incomingData[key];
        isModified = true;
      }
    }

    if (!isModified) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "User details updated successfully",
      user: {
        _id: user._id,
        isAdminVerified: user.isAdminVerified,
        bio: user.bio,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        rollNo: user.rollNo,
        gender: user.gender,
        popularity: user.popularity,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in updateTextDetails:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error in updateTextDetails" });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
      // Clean up uploaded file if validation fails
      if (file.path) {
        try {
          await unlinkAsync(file.path);
        } catch (cleanupError) {
          console.error("Error cleaning up invalid file:", cleanupError);
        }
      }
      return res.status(400).json({ message: "Invalid image format" });
    }
    let url = "";
    let public_id = "";
    try {
      const uploadResult = await uploadOnCloudinary(file.path);
      url = uploadResult.url;
      public_id = uploadResult.public_id;

      if (file.path) {
        try {
          await unlinkAsync(file.path);
        } catch (cleanupError) {
          console.error("Error cleaning up temporary file:", cleanupError);
          // Don't fail the request if cleanup fails
        }
      }
      if (!url || !public_id) {
        return res.status(400).json({ message: "Image upload failed" });
      }

      // Clean up temporary file after successful upload
    } catch (uploadError) {
      // Clean up temporary file if upload fails
      if (file.path) {
        try {
          await unlinkAsync(file.path);
        } catch (cleanupError) {
          console.error(
            "Error cleaning up file after upload failure:",
            cleanupError
          );
        }
      }
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({ message: "Image upload failed" });
    }
    // If user already has a profile picture, delete it from Cloudinary
    if (user.profilePicture && user.profilePicture.public_id) {
      try {
        await deleteFromCloudinary(user.profilePicture.public_id);
      } catch (error) {
        console.error("Error deleting old profile picture:", error);
        return res
          .status(500)
          .json({ message: "Failed to delete old picture" });
      }
    }

    // Update user's profile picture
    user.profilePicture = {
      url: url,
      public_id: public_id,
    };
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: {
        _id: user._id,
        isAdminVerified: user.isAdminVerified,
        bio: user.bio,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        rollNo: user.rollNo,
        gender: user.gender,
        popularity: user.popularity,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in updateProfilePicture:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error in updateProfilePicture" });
  }
};

const updateBio = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { bio } = req.body;
    if (!bio) {
      return res.status(400).json({ message: "Bio is required" });
    }
    const size = Buffer.byteLength(bio, "utf-8");
    if (size > 200) {
      return res.status(400).json({
        message: "Bio must be less than 200 characters",
      });
    }

    user.bio = bio;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "Bio updated successfully",
      user: {
        _id: user._id,
        isAdminVerified: user.isAdminVerified,
        bio: user.bio,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        rollNo: user.rollNo,
        gender: user.gender,
        popularity: user.popularity,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in updateBio:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error in updateBio" });
  }
};

const getUser = async (req, res) => {
  try {
    const { username } = req.query;

    // Validate username input
    if (!username || typeof username !== "string" || !username.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Avoid regex injection or unnecessary regex usage
    const cleanUsername = username.trim();

    const regex = new RegExp(`^${cleanUsername}`, "i"); // Case-insensitive exact match

    const user = await User.findOne({ username: regex }).select(
      "_id username fullName profilePicture popularity bio"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getUser:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error in getUser" });
  }
};

const sendOtpForResetPassword = async (req, res) => {
  const session = await mongoose.startSession();
  try {
     session.startTransaction();
     const {email} = req.body
  
    if (!email) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Email is required" });
    }

    const existedUser = await User.findOne({email});
    if (!existedUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();

    const otpInstance = await Otp.create(
      [
        {
          userId: existedUser._id,
          purpose: "password-reset",
          otpExpiresAt: Date.now() + 5 * 60 * 1000,
          otp: otp,
          otpAttempts: 0,
          resendAfter: Date.now() + 2 * 60 * 1000,
        }
      ],
      { session }
    );

    if (!otpInstance[0]) {
      await session.abortTransaction();
      return res.status(400).json({ message: "OTP not created" });
    }

    try {
      await sendEmail(
        existedUser.email,
        "Your OTP for Re-set Password",
        `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
          <div style="max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
            <h2 style="color: #007bff;">SITCoders Verification Code</h2>
            <p>Hi ${existedUser.name || "User"},</p>
            <p>Your One-Time Password (OTP) is:</p>
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; color: #2c3e50;">
              ${otp}
            </div>
            <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>
            <p>Thanks,<br/>Team SITCoders</p>
          </div>
        </body>
        </html>
        `
      );
    } catch (error) {
      console.error("ERR while sending OTP in resetPassword:", error.message);
      await session.abortTransaction();
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    await session.commitTransaction();
    return res.status(201).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("ERR in resetPassword:", error.message);
    await session.abortTransaction();
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};

const verifyOtpForResetPassword = async (req, res) => {
try {
  const {email , otp} = req.body;
  if(!email || !otp){
    return res.status(403).json({message : "Email and otp is required"})
  }
  const user = await User.findOne({email});
  if(!user){
    return res.status(404).json({message : "User not found"});
  }

  const userOtp =await Otp.findOne({userId : user._id , purpose : "password-reset"});

  if(!userOtp){
    return res.status(404).json({message :"Otp not found"});
  }
  const isValid =  await userOtp.isOtpValid(otp);

} catch (error) {
  
}
}


export {
  sendOtpViaEmail,
  verifyOtp,
  resendOtp,
  loginUser,
  logOutUser,
  getCurrentUser,
  updateTextDetails,
  updateProfilePicture,
  updateBio,
  getUser,
  sendOtpForResetPassword,
  verifyOtpForResetPassword
};
