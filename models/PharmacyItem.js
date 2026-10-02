const mongoose = require("mongoose");

const pharmacyItemSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: String,
      default: "HOSP01",
    },
    medicineName: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
      default: "Cipla",
    },
    batchNumber: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    quantityInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    purchaseRate: {
      type: Number,
      required: true,
      default: 0,
    },
    mrp: {
      type: Number,
      required: true,
      default: 0,
    },
    saleRate: {
      type: Number,
      required: true,
      default: 0,
    },
    gstPercent: {
      type: Number,
      default: 12,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PharmacyItem", pharmacyItemSchema);