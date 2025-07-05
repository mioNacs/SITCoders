



const isVarifiedByAdmin = async (req, res, next) => {
  try {
    const user = req.user; // Assuming user is set in the request by a previous middleware
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!user.isAdminVerified) {
      return res.status(403).json({ message: "Admin have not verified you" });
    }

    next();
  } catch (error) {
    console.error("Error in isVarifiedByAdmin middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default isVarifiedByAdmin;