import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    console.error("Error in verifyUser middleware:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyUser;