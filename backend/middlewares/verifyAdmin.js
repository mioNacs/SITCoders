

import Admin from "../models/admin.model.js";


const verifyAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const admin = await Admin.findOne({ admin: user._id});
        if (!admin) {
            return res.status(403).json({ message: "Access denied, not an admin" });
        }
        next();
    } catch (error) {
        console.error("Error in verifyAdmin middleware:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default verifyAdmin;