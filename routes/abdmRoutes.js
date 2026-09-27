const express = require("express");
const router = express.Router();
const { verifyAbha, linkAbhaToPatient, getFhirRecord } = require("../controllers/abdmController");

// Verify ABHA Address: POST /api/abdm/verify
router.post("/verify", verifyAbha);

// Link ABHA to Hospital UHID: POST /api/abdm/link
router.post("/link", linkAbhaToPatient);

// ABDM M2: Export OPD consultation as standard FHIR R4 Bundle
router.get("/fhir/:visitId", getFhirRecord);

module.exports = router;