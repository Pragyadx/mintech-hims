const express = require("express");
const router = express.Router();
const {
  checkInPatient,
  getDoctorQueue,
  completeConsultation,
  getPatientHistory,
} = require("../controllers/opdController");

// Check in patient to OPD: POST /api/opd/check-in
router.post("/check-in", checkInPatient);

// View queue for a doctor: GET /api/opd/queue/:doctorId
router.get("/queue/:doctorId", getDoctorQueue);
// Complete consultation: PUT /api/opd/consultation/:visitId
router.put("/consultation/:visitId", completeConsultation);
// Get patient medical history: GET /api/opd/history/:uhid
router.get("/history/:uhid", getPatientHistory);

module.exports = router;