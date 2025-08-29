import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(400).json({ message: "Access token not provided" });
    }

    // Format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find user in DB
    const user = await User.findOne({
      _id: decodedToken._id,
      isEmailVerified: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or email not verified" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyUser middleware:", error);

    // Handle expired token explicitly
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};


export default verifyUser;
