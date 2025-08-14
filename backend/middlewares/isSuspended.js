import User from "../models/user.model.js";

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

