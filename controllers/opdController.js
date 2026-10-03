const OpdVisit = require("../models/OpdVisit");
const Patient = require("../models/Patient");

// -------------------------------------------------------------
// 1. Mintech: Direct OPD Registration (Front Desk Walk-in)
// -------------------------------------------------------------
exports.registerOpdPatient = async (req, res) => {
  try {
    const hospitalId = req.body.hospitalId || "HOSP01";
    let {
      uhid,
      patientTitle,
      patientName,
      gender,
      maritalStatus,
      mobile,
      email,
      department,
      doctorId,
      doctor,
      slot,
      guardianRelation,
      guardianName,
      ageYears,
      address,
      referredBy,
      panelTpa,
      fee,
      paymentMode,
      abhaNo,
      abhaAddress,
      vitals,
      chiefComplaints
    } = req.body;

    const assignedDoctor = doctorId || doctor || "Dr. EMO";

    // 1. Calculate Daily Token Sequence
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const countToday = await OpdVisit.countDocuments({
      hospitalId,
      createdAt: { $gte: startOfDay }
    });
    const tokenNo = countToday + 1;

    // 2. Generate OPD ID and UHID if not already present
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const opdId = `OP-${Date.now().toString().slice(-4)}${randomSuffix.toString().slice(-2)}`;
    
    if (!uhid || uhid.trim() === "") {
      uhid = `U-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    // 3. Upsert into Patient collection so UHID remains consistent for future visits
    if (Patient) {
      await Patient.findOneAndUpdate(
        { uhid },
        {
          uhid,
          hospitalId,
          name: patientName ? `${patientTitle || ''} ${patientName}`.trim() : "Unknown",
          gender: gender || "Male",
          mobile: mobile || "",
          age: ageYears || 0,
          address: address || ""
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).catch(err => console.warn("Patient upsert non-critical warning:", err.message));
    }

    // 4. Create OPD Visit Entry
    const visit = await OpdVisit.create({
      uhid,
      opdId,
      tokenNo,
      hospitalId,
      patientTitle: patientTitle || "Mr.",
      patientName: patientName || "",
      gender: gender || "Male",
      maritalStatus: maritalStatus || "Single",
      mobile: mobile || "",
      email: email || "",
      department: department || "EMERGENCY",
      doctorId: assignedDoctor,
      slot: slot || "Slot I",
      guardianRelation: guardianRelation || "S/o",
      guardianName: guardianName || "",
      ageYears: Number(ageYears) || 0,
      address: address || "",
      referredBy: referredBy || "SELF",
      panelTpa: panelTpa || "--NA--",
      fee: Number(fee) || 100,
      paymentMode: paymentMode || "Cash",
      abhaNo: abhaNo || "",
      abhaAddress: abhaAddress || "",
      vitals: vitals || {},
      chiefComplaints: chiefComplaints || [],
      status: "Waiting"
    });

    res.status(201).json({
      success: true,
      message: "Patient registered and token generated successfully",
      data: visit
    });
  } catch (error) {
    console.error("Mintech OPD registration error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error"
    });
  }
};

// -------------------------------------------------------------
// 2. MINTECH: Live OPD Queue Table (Today's Outpatients)
// -------------------------------------------------------------
exports.getOpdQueue = async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId || "HOSP01";
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const visits = await OpdVisit.find({
      hospitalId,
      createdAt: { $gte: startOfDay }
    }).sort({ tokenNo: -1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits
    });
  } catch (error) {
    console.error("Fetch OPD queue error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error"
    });
  }
};

// -------------------------------------------------------------
// 3. EXISTING: Check-in patient for an OPD consultation
// -------------------------------------------------------------
exports.checkInPatient = async (req, res) => {
  try {
    const { uhid, hospitalId, doctorId, department, vitals, chiefComplaints } = req.body;

    const patient = await Patient.findOne({ uhid });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: `Invalid UHID: ${uhid}. Patient must be registered before OPD check-in.`
      });
    }

    const visit = await OpdVisit.create({
      uhid,
      hospitalId,
      doctorId,
      department: department || "General Medicine",
      vitals: vitals || {},
      chiefComplaints: chiefComplaints || [],
      status: "Waiting"
    });

    res.status(201).json({
      success: true,
      message: "Patient checked into OPD queue successfully",
      visit
    });
  } catch (error) {
    console.error("OPD check-in error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error"
    });
  }
};

// -------------------------------------------------------------
// 4. EXISTING: Fetch current waiting queue for a specific doctor
// -------------------------------------------------------------
exports.getDoctorQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const queue = await OpdVisit.find({ doctorId, status: "Waiting" }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: queue.length,
      queue
    });
  } catch (error) {
    console.error("Fetch doctor queue error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error"
    });
  }
};

// -------------------------------------------------------------
// 5. EXISTING: Complete consultation, attach diagnosis & prescription
// -------------------------------------------------------------
exports.completeConsultation = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { diagnosis, prescriptions } = req.body;

    const visit = await OpdVisit.findByIdAndUpdate(
      visitId,
      {
        diagnosis,
        prescriptions,
        status: "Completed"
      },
      { new: true }
    );

    if (!visit) {
      return res.status(404).json({
        success: false,
        error: "OPD visit not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Consultation completed and prescription generated successfully",
      visit
    });
  } catch (error) {
    console.error("Consultation update error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error"
    });
  }
};

// -------------------------------------------------------------
// 6. EXISTING: Fetch complete visit history and EMR records
// -------------------------------------------------------------
exports.getPatientHistory = async (req, res) => {
  try {
    const { uhid } = req.params;

    const visits = await OpdVisit.find({ uhid }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalVisits: visits.length,
      history: visits
    });
  } catch (error) {
    console.error("Fetch patient history error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error"
    });
  }
};