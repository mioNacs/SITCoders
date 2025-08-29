import { Router } from "express";
import multer from "multer";
import {
  loginUser,
  logOutUser,
  resendOtp,
  sendOtpViaEmail,
  verifyOtp,
  getCurrentUser,
  updateTextDetails,
  updateProfilePicture,
  updateBio,
  getUser,
  resetPassword,
  verifyOtpForResetPassword,
  sendOtpForResetPassword,
  deleteAccount,
  generateNewToken,
  searchUsersByUsername,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import verifyUser from "../middlewares/verifyUser.js";

const router = Router();

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Route for user registration with optional profile picture upload
router.post(
  "/create",
  upload.single("profilePicture"),
  handleMulterError,
  sendOtpViaEmail
);

router.post("/refresh-token", generateNewToken);

// Route for OTP verification
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", loginUser);
router.get("/logout", verifyUser, logOutUser);
// Route for sending OTP for password reset
router.post("/send-otp-for-reset-password", sendOtpForResetPassword);

// Route for verifying OTP for password reset
router.post("/verify-otp-for-reset-password", verifyOtpForResetPassword);

// Route for resetting password
router.post("/reset-password", resetPassword);

// protected routes
router.get("/current-user", verifyUser, getCurrentUser);
router.post("/update-text-details", verifyUser, updateTextDetails);
router.post(
  "/update-profile-picture",
  verifyUser,
  upload.single("profilePicture"),
  handleMulterError,
  updateProfilePicture
);
router.post("/update-bio", verifyUser, updateBio);
router.post("/get-user", verifyUser, getUser);
router.post(
  "/search-users-by-username",
  verifyUser,
  searchUsersByUsername
);

router.delete("/delete-account",verifyUser,deleteAccount);

export default router;
