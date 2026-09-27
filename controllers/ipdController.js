const IpdAdmission = require("../models/IpdAdmission");
const Patient = require("../models/Patient");

// 1. Admit patient to IPD
exports.admitPatient = async (req, res) => {
  try {
    const { uhid, hospitalId, admittingDoctor, wardType, bedNumber, admissionReason } = req.body;

    // Verify patient exists
    const patient = await Patient.findOne({ uhid });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found with this UHID",
      });
    }

    // Check if bed is already occupied by an active admission
    const activeBed = await IpdAdmission.findOne({ hospitalId, bedNumber, status: "Admitted" });
    if (activeBed) {
      return res.status(400).json({
        success: false,
        error: `Bed ${bedNumber} is currently occupied by another patient`,
      });
    }

    // Check if patient is already admitted
    const alreadyAdmitted = await IpdAdmission.findOne({ uhid, status: "Admitted" });
    if (alreadyAdmitted) {
      return res.status(400).json({
        success: false,
        error: "Patient is already actively admitted in an IPD ward",
      });
    }

    // Generate sequential IPD Number: IPD-HOSP01-000001
    const count = await IpdAdmission.countDocuments({ hospitalId });
    const sequence = String(count + 1).padStart(6, "0");
    const ipdNumber = `IPD-${hospitalId}-${sequence}`;

    const admission = await IpdAdmission.create({
      ipdNumber,
      uhid,
      hospitalId,
      admittingDoctor,
      wardType,
      bedNumber,
      admissionReason,
      status: "Admitted",
    });

    res.status(201).json({
      success: true,
      message: "Patient admitted to IPD successfully",
      admission,
    });
  } catch (error) {
    console.error("IPD admission error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// 2. Discharge patient and attach discharge summary
exports.dischargePatient = async (req, res) => {
  try {
    const { ipdNumber } = req.params;
    const { conditionAtDischarge, treatmentGiven, dischargeAdvice } = req.body;

    const admission = await IpdAdmission.findOne({ ipdNumber, status: "Admitted" });
    if (!admission) {
      return res.status(404).json({
        success: false,
        error: "Active IPD admission record not found",
      });
    }

    admission.status = "Discharged";
    admission.dischargeDate = new Date();
    admission.dischargeSummary = {
      conditionAtDischarge: conditionAtDischarge || "Stable",
      treatmentGiven,
      dischargeAdvice,
    };

    await admission.save();

    res.status(200).json({
      success: true,
      message: "Patient discharged and summary recorded successfully",
      admission,
    });
  } catch (error) {
    console.error("IPD discharge error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// 3. Get all active admitted patients in the hospital
exports.getActiveAdmissions = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const admissions = await IpdAdmission.find({ hospitalId, status: "Admitted" }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      occupiedBeds: admissions.length,
      admissions,
    });
  } catch (error) {
    console.error("Fetch active admissions error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};