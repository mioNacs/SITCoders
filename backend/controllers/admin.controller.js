import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import { deleteFromCloudinary } from "../middlewares/cloudinary.js";
import { sendEmail } from "../utilities/transporter.js";

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

const removeFromAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!req.isSuperAdmin) {
      return res
        .status(403)
        .json({ message: "Access denied, not a super admin" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const admin = await Admin.findOne({ admin: user._id });
    if (!admin) {
      return res.status(404).json({ message: "User is not an admin" });
    }
    // Delete the admin record
    await Admin.deleteOne({ _id: admin._id });

    return res.status(200).json({ message: "Admin removed successfully" });
  } catch (error) {
    console.error("Error removing admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUnverifiedUsers = async (req, res) => {
  try {
    const unverifiedUsers = await User.find({ isAdminVerified: false }).select(
      "-password -__v"
    );

    if (unverifiedUsers.length === 0) {
      return res.status(200).json({ message: "All users are verified" });
    }

    res.status(200).json({
      message: "Unverified users fetched successfully",
      users: unverifiedUsers,
    });
  } catch (error) {
    console.error("Error fetching unverified users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVerifiedUser = async (req, res) => {
  try {
    // Default values if not provided
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({ isAdminVerified: true })
        .select("-password -__v")
        .skip(skip)
        .limit(limit),

      User.countDocuments({ isAdminVerified: true }),
    ]);

    return res.status(200).json({
      message: "Verified users fetched successfully",
      users,
      pagination: {
        totalUsers: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + users.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching verified users:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyUserFromAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email, isAdminVerified: false });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or already verified" });
    }
    user.isAdminVerified = true;
    await user.save({ validateBeforeSave: false });

    await sendEmail(
      user.email,
      "Account Verified",
      `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #4CAF50;">Account Verified</h2>
      <p>Dear ${user.fullName || "User"},</p>
      <p>Your account has been <strong>successfully verified</strong> by the admin.</p>
      <p>You can now log in and start using all the features of your account.</p>
      <a href="http://yourfrontenddomain.com/login" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Log In Now</a>
      <p style="margin-top: 30px;">Thank you,<br>SIT coders</p>
    </div>
  `
    );

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
      return res
        .status(404)
        .json({ message: "User not found or already verified" });
    }
    // Delete user's profile picture from Cloudinary if it exists
    if (user.profilePicture && user.profilePicture.public_id) {
      await deleteFromCloudinary(user.profilePicture.public_id);
    }
    await sendEmail(
      user.email,
      "Account Rejected",
      `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #F44336;">Account Rejected</h2>
      <p>Dear ${user.fullName || "User"},</p>
      <p>Your account has been <strong>rejected</strong> by the admin.</p>
      <p>If you believe this is a mistake, please contact support.</p>
      <p style="margin-top: 30px;">Thank you,<br>SIT coders</p>
    </div>
  `
    );
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User rejected successfully" });
  } catch (error) {
    console.error("Error rejecting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const isAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const admin = await Admin.findOne({ admin: user._id }).populate("admin");
    if (!admin) {
      return res.status(200).json({
        isAdmin: false,
        role: null,
        adminData: null,
        message: "User is not an admin",
      });
    }

    return res.status(200).json({
      isAdmin: true,
      role: admin.role,
      adminData: {
        id: admin._id,
        role: admin.role,
        createdAt: admin.createdAt,
      },
      message: "User is an admin",
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const suspendAccount = async (req, res) => {
  try {
    const { email, duration , durationIn} = req.body;
    if(!email || !duration){
      return res.status(400).json({message : "Email and duration are required"})
    }
    const user = await User.findOne({ email });

    if(!user){
      return res.status(404).json({message  : "User not found"})
    }

    // const admin = await Admin.findById({ admin: user._id });
    // if(admin){
    //   return res.status(403).json({message : "You cannot suspend an admin account"})
    // }

    if(durationIn === 'hours'){
        user.suspensionEnd = new Date(Date.now() + duration * 60 * 60 * 1000);
    }
    if(durationIn === 'days'){
        user.suspensionEnd = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    }
    if(durationIn === 'weeks'){
        user.suspensionEnd = new Date(Date.now() + duration * 7 * 24 * 60 * 60 * 1000);
    }
    if(durationIn === 'months'){
        user.suspensionEnd = new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000);
    }
    if(durationIn === 'years'){
        user.suspensionEnd = new Date(Date.now() + duration * 365 * 24 * 60 * 60 * 1000);
    }
    if(durationIn === 'forever'){
        user.suspensionEnd = null;
    }
    user.isSuspended = true;
    await user.save();
    return res.status(200).json({message : "User suspended successfully"})
  } catch (error) {
    console.error("Error suspending account:", error.message);
    return res.status(500).json({message : "Internal server error"})
  }

}

export {
  createAdmin,
  getAllUnverifiedUsers,
  verifyUserFromAdmin,
  rejectUserFromAdmin,
  isAdmin,
  getVerifiedUser,
  removeFromAdmin,
  suspendAccount,
};
