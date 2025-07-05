import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(400).json({ message: "token not provided" });
    }
    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyUser;
