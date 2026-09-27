const mongoose = require("mongoose");

const ipdAdmissionSchema = new mongoose.Schema(
  {
    ipdNumber: {
      type: String,
      unique: true,
      required: true,
    },
    uhid: {
      type: String,
      required: true,
      ref: "Patient",
    },
    hospitalId: {
      type: String,
      required: true,
    },
    admittingDoctor: {
      type: String,
      required: true,
    },
    wardType: {
      type: String,
      enum: ["General Ward", "Semi-Private", "Private", "ICU", "Emergency"],
      required: true,
    },
    bedNumber: {
      type: String,
      required: true,
    },
    admissionReason: {
      type: String,
      required: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    dischargeDate: {
      type: Date,
      default: null,
    },
    dischargeSummary: {
      conditionAtDischarge: { type: String, default: null },
      treatmentGiven: { type: String, default: null },
      dischargeAdvice: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ["Admitted", "Discharged", "Transferred"],
      default: "Admitted",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IpdAdmission", ipdAdmissionSchema);