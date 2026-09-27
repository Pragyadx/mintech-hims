const express = require("express");
const router = express.Router();
const {
  admitPatient,
  dischargePatient,
  getActiveAdmissions,
} = require("../controllers/ipdController");

// Admit patient: POST /api/ipd/admit
router.post("/admit", admitPatient);

// Discharge patient: PUT /api/ipd/discharge/:ipdNumber
router.put("/discharge/:ipdNumber", dischargePatient);

// View currently admitted patients/occupied beds: GET /api/ipd/active/:hospitalId
router.get("/active/:hospitalId", getActiveAdmissions);

module.exports = router;