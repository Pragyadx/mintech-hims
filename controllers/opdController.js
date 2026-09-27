const OpdVisit = require("../models/OpdVisit");
const Patient = require("../models/Patient");

// Check in a patient for an OPD consultation
exports.checkInPatient = async (req, res) => {
  try {
    const { uhid, hospitalId, doctorId, department, vitals, chiefComplaints } = req.body;

    // 1. Verify the patient exists using their UHID
    const patient = await Patient.findOne({ uhid });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: `Invalid UHID: ${uhid}. Patient must be registered before OPD check-in.`,
      });
    }

    // 2. Create the OPD visit entry
    const visit = await OpdVisit.create({
      uhid,
      hospitalId,
      doctorId,
      department: department || "General Medicine",
      vitals: vitals || {},
      chiefComplaints: chiefComplaints || [],
      status: "Waiting",
    });

    res.status(201).json({
      success: true,
      message: "Patient checked into OPD queue successfully",
      visit,
    });
  } catch (error) {
    console.error("OPD check-in error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// Fetch current waiting queue for a specific doctor
exports.getDoctorQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const queue = await OpdVisit.find({ doctorId, status: "Waiting" }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: queue.length,
      queue,
    });
  } catch (error) {
    console.error("Fetch doctor queue error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};
// Complete consultation, attach diagnosis & prescription
exports.completeConsultation = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { diagnosis, prescriptions } = req.body;

    const visit = await OpdVisit.findByIdAndUpdate(
      visitId,
      {
        diagnosis,
        prescriptions,
        status: "Completed",
      },
      { new: true }
    );

    if (!visit) {
      return res.status(404).json({
        success: false,
        error: "OPD visit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Consultation completed and prescription generated successfully",
      visit,
    });
  } catch (error) {
    console.error("Consultation update error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};
// Fetch complete visit history and EMR records for a patient
exports.getPatientHistory = async (req, res) => {
  try {
    const { uhid } = req.params;

    // Find all visits for this patient, sorted newest to oldest
    const visits = await OpdVisit.find({ uhid }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalVisits: visits.length,
      history: visits,
    });
  } catch (error) {
    console.error("Fetch patient history error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};