const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    invoiceNumber: {
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
      required: false,
    },
    hospitalId: {
      type: String,
      required: true,
    },
    items: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partially Paid"],
      default: "Paid",
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Insurance"],
      default: "UPI",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Billing", billingSchema);