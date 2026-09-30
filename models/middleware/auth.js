const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "HIMS_SECURE_KEY_2026_PRODUCTION_HEALTH";

// 1. Verify User is Logged In
exports.protect = async (req, res, next) => {
let token;

  // 1. Check HttpOnly cookie first, then fallback to Bearer header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access denied. Please log in first.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        error: "User account not active or does not exist.",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Session expired or invalid login token.",
    });
  }
};

// 2. Role-Based Access Control (Authorize Specific Roles)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Admin always has master access
    if (req.user.role === "Admin") {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access forbidden: Your role (${req.user.role}) is not authorized for this section.`,
      });
    }
    next();
  };
};

exports.JWT_SECRET = JWT_SECRET;
