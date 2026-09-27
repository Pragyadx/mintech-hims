const mongoose = require("mongoose");

const pharmacyItemSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: String,
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
    },
    quantityInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PharmacyItem", pharmacyItemSchema);