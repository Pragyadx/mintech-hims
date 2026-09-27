const express = require("express");
const router = express.Router();
const {
  registerPatient,
  getPatientByUhid,
} = require("../controllers/patientController");

// End point to register a patient: POST /api/patients
router.post("/", registerPatient);

// End point to fetch a patient by UHID: GET /api/patients/:uhid
router.get("/:uhid", getPatientByUhid);

module.exports = router;