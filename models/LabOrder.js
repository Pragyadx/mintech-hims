const mongoose = require("mongoose");

const labOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    uhid: {
      type: String,
      required: true,
      ref: "Patient",
    },
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OpdVisit",
      required: true,
    },
    hospitalId: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      default: "Consultant Physician",
    },
    tests: [
      {
        testName: { type: String, required: true }, // e.g. "Complete Blood Count (CBC)"
        category: { type: String, enum: ["Pathology", "Radiology", "Biochemistry"], default: "Pathology" },
        resultValue: { type: String, default: null }, // e.g. "14.2 g/dL"
        referenceRange: { type: String, default: null }, // e.g. "13.0 - 17.0 g/dL"
        unit: { type: String, default: null }, // e.g. "g/dL"
        remarks: { type: String, default: "Normal" },
      },
    ],
    status: {
      type: String,
      enum: ["Ordered", "Sample Collected", "Completed", "Cancelled"],
      default: "Ordered",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabOrder", labOrderSchema);