const express = require("express");
const router = express.Router();
const {
  checkInPatient,
  getDoctorQueue,
  completeConsultation,
  getPatientHistory,
  registerOpdPatient,
  getOpdQueue,
} = require("../controllers/opdController");

// Mintech: Live OPD Queue (Today's Outpatient Registry)
router.get("/", getOpdQueue);
router.get("/queue", getOpdQueue);
router.get("/queue/hospital/:hospitalId", getOpdQueue);

// Mintech: Walk-in OPD Registration & Token Generation
router.post("/register", registerOpdPatient);

// Existing: Check in patient to OPD: POST /api/opd/check-in
router.post("/check-in", checkInPatient);

// Existing: View queue for a doctor: GET /api/opd/queue/:doctorId
router.get("/queue/:doctorId", getDoctorQueue);

// Existing: Complete consultation: PUT /api/opd/consultation/:visitId
router.put("/consultation/:visitId", completeConsultation);

// Existing: Get patient medical history: GET /api/opd/history/:uhid
router.get("/history/:uhid", getPatientHistory);

module.exports = router;