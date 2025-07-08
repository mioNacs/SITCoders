import Admin from "../models/admin.model";



const verifySuperAdmin = async (req, res, next) => {
    try {
        const user = req.user._id; // Assuming user ID is stored in req.user
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const admin = await Admin.findOne({ admin: user, role: "superadmin" });
        if (!admin) {
            return res.status(403).json({ message: "Access denied, not a super admin" });
        }
        req.isSuperAdmin = true; // Set a flag to indicate super admin access
        next();
    } catch (error) {
        console.error("Error in verifySuperAdmin middleware:", error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}


export default verifySuperAdmin;