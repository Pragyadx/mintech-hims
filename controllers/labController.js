const LabOrder = require("../models/LabOrder");
const OpdVisit = require("../models/OpdVisit");

// 1. Doctor creates an investigation order
exports.createLabOrder = async (req, res) => {
  try {
    const { visitId, tests, doctorName } = req.body;

    const visit = await OpdVisit.findById(visitId);
    if (!visit) {
      return res.status(404).json({
        success: false,
        error: "OPD visit not found",
      });
    }

    const orderCount = await LabOrder.countDocuments({ hospitalId: visit.hospitalId });
    const sequence = String(orderCount + 1).padStart(6, "0");
    const orderId = `LAB-${visit.hospitalId}-${sequence}`;

    const labOrder = await LabOrder.create({
      orderId,
      uhid: visit.uhid,
      visitId,
      hospitalId: visit.hospitalId,
      doctorName: doctorName || "Consultant Doctor",
      tests,
      status: "Ordered",
    });

    res.status(201).json({
      success: true,
      message: "Lab investigation order created successfully",
      labOrder,
    });
  } catch (error) {
    console.error("Create lab order error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// 2. Lab technician uploads results
exports.updateLabResults = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { tests, status } = req.body;

    const labOrder = await LabOrder.findOneAndUpdate(
      { orderId },
      { tests, status: status || "Completed" },
      { new: true }
    );

    if (!labOrder) {
      return res.status(404).json({
        success: false,
        error: "Lab order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lab test results recorded successfully",
      labOrder,
    });
  } catch (error) {
    console.error("Update lab results error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// 3. Fetch all lab reports for a patient
exports.getLabReportsByUhid = async (req, res) => {
  try {
    const { uhid } = req.params;
    const reports = await LabOrder.find({ uhid }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Fetch lab reports error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};