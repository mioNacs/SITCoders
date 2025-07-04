import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import { deleteFromCloudinary } from "../middlewares/cloudinary.js";

const createAdmin = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isAdmin = await Admin.findOne({ admin: user._id });
    if (isAdmin) {
      return res.status(400).json({ message: "User is already an admin" });
    }

    const admin = new Admin({
      admin: user._id,
      role: role,
    });
    await admin.save({ validateBeforeSave: false });

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error " });
  }
};

const getAllUnverifiedUsers = async (req, res) => {
  try {
    console.log("Fetching all unverified users");
    
    const unverifiedUsers = await User.find({ isAdminVerified: false })
      .select("-password -__v");

    if (unverifiedUsers.length === 0) {
      return res.status(404).json({ message: "No unverified users found" });
    }

    res.status(200).json({ message: "Unverified users fetched successfully", users: unverifiedUsers });

  } catch (error) {
    console.error("Error fetching unverified users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyUserFromAdmin = async (req,res) => {
  try {
    const {email} = req.body;
    if(!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email, isAdminVerified: false });
    if (!user) {
      return res.status(404).json({ message: "User not found or already verified" });
    }
    user.isAdminVerified = true;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ message: "User verified successfully", user });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};  

const rejectUserFromAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email, isAdminVerified: false });
    if (!user) {
      return res.status(404).json({ message: "User not found or already verified" });
    }
    // Delete user's profile picture from Cloudinary if it exists
    if (user.profilePicture) {
      await deleteFromCloudinary(user.profilePicture.public_id);
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User rejected successfully" });
  } catch (error) {
    console.error("Error rejecting user:", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
};
const isAdmin = async (req, res) => {
try {
    const {email} = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const admin = await Admin.findOne({ admin: user._id });
    if (!admin) {
      return res.status(404).json({ message: "User is not an admin" });
    }
    return res.status(200).json({ message: "User is an admin", isAdmin: true });
} catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export { createAdmin, getAllUnverifiedUsers, verifyUserFromAdmin, rejectUserFromAdmin,isAdmin};
