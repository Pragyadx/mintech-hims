const express = require("express");
const router = express.Router();
const { login, seedUsers } = require("../controllers/authController");
const { login, seedUsers, logout } = require("../controllers/authController");

// Login endpoint: POST /api/auth/login
router.post("/login", login);
router.post("/logout", logout);

// Initialize demo accounts: POST /api/auth/seed
router.post("/seed", seedUsers);

module.exports = router;