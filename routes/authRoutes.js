const express = require("express");
const router = express.Router();
const { login, seedUsers } = require("../controllers/authController");

// Login endpoint: POST /api/auth/login
router.post("/login", login);

// Initialize demo accounts: POST /api/auth/seed
router.post("/seed", seedUsers);

module.exports = router;