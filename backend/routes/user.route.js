
import { Router } from "express";
import multer from "multer";
import { sendEmailViaOtp, verifyOtp } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Route for user registration with optional profile picture upload
router.post("/create", upload.single('profilePicture'), handleMulterError, sendEmailViaOtp);

// Route for OTP verification
router.post("/verify-otp", verifyOtp);

export default router;