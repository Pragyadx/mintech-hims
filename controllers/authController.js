const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

// 1. Staff Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide both email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    // Set secure clinical HttpOnly session cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000 // 8-hour hospital shift
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        hospitalId: user.hospitalId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// 2. Auto-seed Demo Accounts (for sales pitch & testing)
exports.seedUsers = async (req, res) => {
  try {
    const defaultUsers = [
      { name: "Dr. Sharma (MD)", email: "doctor@hospital.com", password: "doc123", role: "Doctor", department: "General Medicine" },
      { name: "Pooja (Reception Desk)", email: "reception@hospital.com", password: "recep123", role: "Receptionist", department: "Front Desk" },
      { name: "Suresh (Billing Desk)", email: "cashier@hospital.com", password: "cash123", role: "Cashier", department: "Accounts" },
      { name: "Anita (Lab Tech)", email: "lab@hospital.com", password: "lab123", role: "LabTech", department: "Pathology" },
      { name: "Vikram (Pharmacist)", email: "pharmacy@hospital.com", password: "pharma123", role: "Pharmacist", department: "Dispensary" },
      { name: "Super Administrator", email: "admin@hospital.com", password: "admin123", role: "Admin", department: "Management" },
    ];

    for (const u of defaultUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
      }
    }

    res.status(200).json({
      success: true,
      message: "Hospital staff demo accounts initialized successfully!",
    });
  } catch (error) {
    console.error("Seed users error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};