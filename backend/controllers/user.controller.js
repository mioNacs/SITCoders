import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../middlewares/cloudinary.js";
import Otp from "../models/otp.model.js";
import { transporter, sendMail } from "../utilities/transporter.js";
import fs from "fs";
import { promisify } from "util";
import generateOtp from "../utilities/generateOtp.js";

const unlinkAsync = promisify(fs.unlink);

function isValidRollNo(rollNo) {
  const pattern = /^(\d{2})(cse|ee|me|ce|dee|dme|dcse|dce)(\d{1,3})$/i;
  return pattern.test(rollNo);
}

const sendEmailViaOtp = async (req, res) => {
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
      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
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
            console.error("Error cleaning up file after upload failure:", cleanupError);
          }
        }
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const newUser = await User.create({
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
    });
    if (!newUser) {
      return res.status(500).json({ message: "User creation failed" });
    }
    //now generate OTP
    const otp = generateOtp();
    if (!otp) {
      return res.status(500).json({ message: "OTP generation failed" });
    }
    const otpInstance =  await Otp.create({
      userId: newUser._id,
      purpose: "email-verification",
      otpExpiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
      otp: otp,
      otpAttempts: 0,
    });
    // Here you would send the OTP to the user's email
    await otpInstance.sendOtpViaEmail(transporter, email, otp);

    return res.status(200).json({
      message: `OTP sent to your email ${email}.`,
      email: email,
    });
  } catch (error) {
    console.error("Error in sendEmailViaOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
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
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    // OTP is valid, proceed with verification
    await User.updateOne({ _id: user._id }, { isEmailVerified: true });
    // await otpInstance.remove();
    await sendMail(
      email,
      "Email Verified",
      "Your email has been successfully verified. and sent it to the admin for verification"
    );
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { sendEmailViaOtp, verifyOtp };
