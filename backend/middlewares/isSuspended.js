import User from "../models/user.model.js";
import { sendEmail } from "../utilities/transporter.js";

const isSuspended = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isSuspended) {
      // If suspension is temporary, check if time is over
      if (user.suspensionEnd && user.suspensionEnd < new Date()) {
        // Suspension expired → remove suspension
        user.isSuspended = false;
        user.suspensionEnd = null;
        await sendEmail(
          user.email,
          "Account Suspension Removed",
          `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4CAF50;">Account Suspension Removed</h2>
          <p>Dear ${user.fullName || "User"},</p>
          <p>Your account suspension has been <strong>Over</strong>.</p>
          <p>Now you can access your account.</p>
          <p style="margin-top: 30px;">Thank you,<br>SIT coders</p>
        </div>
      `
        );
        await user.save();
        return next();
      }

      // If suspension is permanent or still active
      return res.status(403).json({ message: "Account is suspended" });
    }

    next();
  } catch (error) {
    console.error("Error checking suspension status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default isSuspended;
