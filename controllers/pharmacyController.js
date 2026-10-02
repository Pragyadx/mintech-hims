const PharmacyItem = require("../models/PharmacyItem");

// @desc Add new medicine / batch (Inward Purchase Entry)
exports.addMedicine = async (req, res) => {
  try {
    const {
      name,
      company,
      batchNumber,
      expiryDate,
      stockQuantity,
      purchaseRate,
      mrp,
      saleRate,
      gstPercent,
      hospitalId,
    } = req.body;

    if (!name || !batchNumber || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Medicine name, batch number, and expiry date are required",
      });
    }

    const item = await PharmacyItem.create({
      hospitalId: hospitalId || "HOSP01",
      medicineName: name,
      company: company || "Standard Pharma",
      batchNumber: batchNumber.toUpperCase(),
      expiryDate,
      quantityInStock: Number(stockQuantity) || 0,
      purchaseRate: Number(purchaseRate) || 0,
      mrp: Number(mrp) || 0,
      saleRate: Number(saleRate) || 0,
      gstPercent: Number(gstPercent) || 12,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all pharmacy stock ledger items
exports.getInventory = async (req, res) => {
  try {
    const items = await PharmacyItem.find().sort({ createdAt: -1 });

    // Format fields so the frontend table displays them cleanly
    const formatted = items.map((item) => ({
      _id: item._id,
      name: item.medicineName,
      company: item.company,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate,
      stockQuantity: item.quantityInStock,
      purchaseRate: item.purchaseRate,
      mrp: item.mrp,
      saleRate: item.saleRate,
      gstPercent: item.gstPercent,
    }));

    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};