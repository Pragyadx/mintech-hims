const Patient = require("../models/Patient");

// Register a new patient with auto-generated UHID
exports.registerPatient = async (req, res) => {
  try {
    const { hospitalId, name, age, gender, phone, bloodGroup } = req.body;

    // Validate required fields
    if (!hospitalId || !name || !age || !gender || !phone) {
      return res.status(400).json({
        success: false,
        error: "Please provide hospitalId, name, age, gender, and phone.",
      });
    }
    // Check if a patient already exists with this phone number in this hospital
    const existingPatient = await Patient.findOne({ phone, hospitalId });
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: "Patient already registered with this phone number",
        uhid: existingPatient.uhid,
        patient: existingPatient,
      });
    }
// Auto-generate UHID based on existing patient count for this hospital
    const patientCount = await Patient.countDocuments({ hospitalId });
    const sequenceNumber = String(patientCount + 1).padStart(6, "0");
    const uhid = `UHID-${hospitalId}-${sequenceNumber}`;

    // Create the patient record
    const patient = await Patient.create({
      hospitalId,
      uhid,
      name,
      age,
      gender,
      phone,
      bloodGroup,
    });

    res.status(201).json({
      success: true,
      message: "Patient registered successfully with UHID",
      patient,
    });
  } catch (error) {
    console.error("Patient registration error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};
// Get patient details by UHID
exports.getPatientByUhid = async (req, res) => {
  try {
    const { uhid } = req.params;

    const patient = await Patient.findOne({ uhid });

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: `No patient found with UHID: ${uhid}`,
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Fetch patient error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};