import cron from "node-cron";
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";

cron.schedule("*/5 * * * *", async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const unverifiedUsers = await User.find({
      isEmailVerified: false,
      createdAt: { $lt: fiveMinutesAgo },
    });

    if (unverifiedUsers.length > 0) {
      const userIds = unverifiedUsers.map((user) => user._id);

      await User.deleteMany({
        _id: { $in: userIds },
        isEmailVerified: false, // double-check
      });

      await OTP.deleteMany({
        userId: { $in: userIds },
      });

      console.log(
        `[CRON] Deleted ${
          unverifiedUsers.length
        } unverified users created before ${fiveMinutesAgo.toISOString()}`
      );
    } else {
      console.log("[CRON] No unverified users to delete.");
    }
  } catch (error) {
    console.error("[CRON ERROR] Failed to delete unverified users:", error);
  }
});
