import mongoose from "mongoose";
import { sendEmail } from "../utilities/transporter.js";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resendAfter: {
      type: Date,
      default: Date.now,
      required: true,
    },
    purpose: {
      type: String,
      enum: [
        "email-verification",
        "password-reset",
        "Account-deletion",
        "login",
      ],
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    otpExpiresAt: {
      type: Date,
      required: true,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

otpSchema.methods.isOtpValid = function (inputOtp) {
  const isValid = this.otp === inputOtp && Date.now() < this.otpExpiresAt;
  if (isValid) {
    this.otpAttempts = 0;
  } else {
    this.otpAttempts += 1;
  }

  return isValid;
};
otpSchema.methods.hasExceededMaxAttempts = function () {
  const MAX_ATTEMPTS = 3;
  return this.otpAttempts >= MAX_ATTEMPTS;
};

otpSchema.methods.isOtpExpired = function () {
  return Date.now() > this.otpExpiresAt;
};
otpSchema.methods.removeInstance = async function () {
  try {
    await this.deleteOne();
    console.log("OTP instance removed successfully");
  } catch (err) {
    console.error("Error removing OTP instance:", err);
    throw new Error("Failed to remove OTP instance");
  }
};

otpSchema.methods.resetOtp = function () {
  this.otp = "";
  this.otpExpiresAt = null;
  this.otpAttempts = 0;
};
otpSchema.methods.sendOtpViaEmail = async function (email, otp) {
  try {
   await sendEmail(
      email,
      `Your OTP for ${this.purpose}`,
      `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #673AB7;">One-Time Password (OTP)</h2>
      <p>Your OTP is <strong>${otp}</strong>. It is valid for <strong>5 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p style="margin-top: 30px;">Thank you,<br>The Team</p>
    </div>
  `
    );
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP via email");
  }
};

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
