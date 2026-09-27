const mongoose = require("mongoose");

const opdVisitSchema = new mongoose.Schema(
  {
    uhid: {
      type: String,
      required: true,
      ref: "Patient",
    },
    hospitalId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      default: "General Medicine",
    },
    vitals: {
      bp: { type: String }, // e.g., "120/80"
      pulse: { type: Number }, // e.g., 72
      temperature: { type: Number }, // e.g., 98.6
      weight: { type: Number }, // e.g., 70 kg
      spO2: { type: Number }, // e.g., 98%
    },
    chiefComplaints: [
      {
        type: String,
      },
    ],
    diagnosis: {
      type: String,
    },
    prescriptions: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g. "500mg"
        frequency: { type: String, required: true }, // e.g. "1-0-1" (TDS/BD)
        duration: { type: String, required: true }, // e.g. "5 days"
        instructions: { type: String }, // e.g. "After meals"
      },
    ],
    status: {
      type: String,
      enum: ["Waiting", "In-Consultation", "Completed", "Cancelled"],
      default: "Waiting",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OpdVisit", opdVisitSchema);