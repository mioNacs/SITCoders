import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../middlewares/cloudinary.js";
import Otp from "../models/otp.model.js";
import { transporter, sendMail } from "../utilities/transporter.js";
import fs from "fs";
import { promisify } from "util";
import generateOtp from "../utilities/generateOtp.js";
import mongoose from "mongoose";

const unlinkAsync = promisify(fs.unlink);

function isValidRollNo(rollNo) {
  const pattern = /^(\d{2})(cse|ee|me|ce|dee|dme|dcse|dce)(\d{1,3})$/i;
  return pattern.test(rollNo);
}

const sendEmailViaOtp = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { username, fullName, email, password, rollNo, gender, semester } =
      req.body;
    if (
      !username ||
      !fullName ||
      !email ||
      !password ||
      !rollNo ||
      !gender ||
      !semester
    ) {
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
          semester: semester,
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
      await otpInstance[0].sendOtpViaEmail(transporter, email, otp);
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
    console.error("Error in sendEmailViaOtp:", error);
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
    await sendMail(
      email,
      "Email Verified",
      "Your email has been verified successfully and sent to the admin for verification"
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
      sameSite: "none",
    });
    res
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          profile: user.profilePicture.url,
          rollNo: user.rollNo,
          gender: user.gender,
          semester: user.semester,
          popularity: user.popularity,
        },
      });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error in loginUser" });
  }
};

export { sendEmailViaOtp, verifyOtp, resendOtp, loginUser };
