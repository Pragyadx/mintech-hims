const Patient = require("../models/Patient");
const OpdVisit = require("../models/OpdVisit");

// 1. Verify ABHA Address / Number via ABDM Gateway (Sandbox Simulator)
exports.verifyAbha = async (req, res) => {
  try {
    const { abhaAddress } = req.body;

    if (!abhaAddress || !abhaAddress.includes("@")) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid ABHA address (e.g. user@abdm)",
      });
    }

    // In a production environment, this initiates an encrypted handshake with gateway.abdm.gov.in
    // Simulating ABDM Registry verification response
    const mockAbhaProfile = {
      abhaAddress,
      abhaNumber: "14-8765-4321-9012",
      name: "Aarav Sharma",
      gender: "Male",
      dob: "1997-05-14",
      status: "ACTIVE",
      verificationMethod: "MOBILE_OTP_SUCCESS",
    };

    res.status(200).json({
      success: true,
      message: "ABHA verified successfully with ABDM Gateway",
      profile: mockAbhaProfile,
    });
  } catch (error) {
    console.error("ABDM Verification error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// 2. Link verified ABHA details to existing Patient UHID (Milestone 1 Core Requirement)
exports.linkAbhaToPatient = async (req, res) => {
  try {
    const { uhid, abhaAddress, abhaNumber } = req.body;

    const patient = await Patient.findOne({ uhid });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found with this UHID",
      });
    }

    // Verify if ABHA address is already assigned to a different UHID
    const duplicateAbha = await Patient.findOne({ abhaAddress, uhid: { $ne: uhid } });
    if (duplicateAbha) {
      return res.status(409).json({
        success: false,
        error: "This ABHA address is already linked with another hospital UHID",
      });
    }

    patient.abhaAddress = abhaAddress;
    patient.abhaNumber = abhaNumber || "14-8765-4321-9012";
    patient.isAbhaLinked = true;
    await patient.save();

    res.status(200).json({
      success: true,
      message: "ABHA profile successfully linked to patient UHID",
      patient,
    });
  } catch (error) {
    console.error("Link ABHA error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// 3. ABDM Milestone 2 (M2): Generate FHIR Bundle for Patient Health Records
exports.getFhirRecord = async (req, res) => {
  try {
    const { visitId } = req.params;

    // Fetch visit details
    const visit = await OpdVisit.findById(visitId);
    if (!visit) {
      return res.status(404).json({
        success: false,
        error: "OPD visit not found",
      });
    }

    // Fetch patient details
    const patient = await Patient.findOne({ uhid: visit.uhid });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }

    // Standard ABDM FHIR Diagnostic/Prescription Record Bundle
    const fhirBundle = {
      resourceType: "Bundle",
      id: `bundle-${visit._id}`,
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle"],
      },
      identifier: {
        system: "https://abdm.gov.in/bundle",
        value: `FHIR-${visit._id}`,
      },
      type: "document",
      timestamp: new Date().toISOString(),
      entry: [
        // 1. Patient Resource
        {
          resource: {
            resourceType: "Patient",
            id: patient.uhid,
            identifier: [
              { system: "https://healthid.ndhm.gov.in", value: patient.abhaAddress || "N/A" },
              { system: "https://hospital.org/uhid", value: patient.uhid },
            ],
            name: [{ text: patient.name }],
            gender: patient.gender.toLowerCase(),
            telecom: [{ system: "phone", value: patient.phone }],
          },
        },
        // 2. Encounter / Visit Resource
        {
          resource: {
            resourceType: "Encounter",
            id: `visit-${visit._id}`,
            status: "finished",
            class: { code: "AMB", display: "Ambulatory (OPD)" },
            subject: { reference: `Patient/${patient.uhid}` },
            reasonCode: [{ text: visit.chiefComplaints }],
          },
        },
        // 3. Condition / Diagnosis Resource
        {
          resource: {
            resourceType: "Condition",
            id: `diag-${visit._id}`,
            clinicalStatus: { coding: [{ code: "active" }] },
            code: { text: visit.diagnosis || "Under evaluation" },
            subject: { reference: `Patient/${patient.uhid}` },
          },
        },
        // 4. MedicationRequest (Prescriptions)
        ...visit.prescriptions.map((med, index) => ({
          resource: {
            resourceType: "MedicationRequest",
            id: `med-${visit._id}-${index + 1}`,
            status: "active",
            intent: "order",
            medicationCodeableConcept: { text: med.medicineName },
            subject: { reference: `Patient/${patient.uhid}` },
            dosageInstruction: [
              {
                text: `${med.dosage}, ${med.frequency} for ${med.duration}`,
              },
            ],
          },
        })),
      ],
    };

    res.status(200).json({
      success: true,
      message: "ABDM FHIR Bundle generated successfully",
      fhirBundle,
    });
  } catch (error) {
    console.error("FHIR generation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};