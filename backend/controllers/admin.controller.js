import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

const createAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const admin = new Admin({
      admin: user._id,
      role: "admin",
    });
    await admin.save({ validateBeforeSave: false });

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error " });
  }
};

const getAllUnverifiedUsers = async (req, res) => {};

export { createAdmin };
