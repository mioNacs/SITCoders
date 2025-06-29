import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

otpSchema.methods.generateOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.otp = otp;
  this.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  this.otpAttempts = 0;

  return otp;
};

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
otpSchema.methods.resetOtp = function () {
  this.otp = "";
  this.otpExpiresAt = null;
  this.otpAttempts = 0;
};
otpSchema.methods.sendOtpViaEmail = async function (transporter, email, otp) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Your OTP for ${this.purpose}`,
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>
              <p>If you did not request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP via email");
  }
};

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
