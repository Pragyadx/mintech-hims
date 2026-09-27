const express = require("express");
const router = express.Router();
const {
  createLabOrder,
  updateLabResults,
  getLabReportsByUhid,
} = require("../controllers/labController");

// Create lab order: POST /api/lab/order
router.post("/order", createLabOrder);

// Update lab test results: PUT /api/lab/results/:orderId
router.put("/results/:orderId", updateLabResults);

// Get all lab reports for a patient: GET /api/lab/reports/:uhid
router.get("/reports/:uhid", getLabReportsByUhid);

module.exports = router;