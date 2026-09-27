const PharmacyItem = require("../models/PharmacyItem");

// 1. Add new stock / medicine batch to pharmacy inventory
exports.addStock = async (req, res) => {
  try {
    const { hospitalId, medicineName, batchNumber, quantityInStock, unitPrice, expiryDate } = req.body;

    // Check if batch already exists for this hospital
    let item = await PharmacyItem.findOne({ hospitalId, medicineName, batchNumber });

    if (item) {
      // If batch exists, increment quantity
      item.quantityInStock += quantityInStock;
      await item.save();
    } else {
      // Create new stock record
      item = await PharmacyItem.create({
        hospitalId,
        medicineName,
        batchNumber,
        quantityInStock,
        unitPrice,
        expiryDate,
      });
    }

    res.status(201).json({
      success: true,
      message: "Pharmacy stock updated successfully",
      item,
    });
  } catch (error) {
    console.error("Add pharmacy stock error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// 2. Dispense medicine and deduct from inventory
exports.dispenseMedicine = async (req, res) => {
  try {
    const { hospitalId, medicineName, quantityToDispense } = req.body;

    const item = await PharmacyItem.findOne({ hospitalId, medicineName });
    if (!item) {
      return res.status(404).json({
        success: false,
        error: `Medicine "${medicineName}" not found in inventory`,
      });
    }

    if (new Date(item.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        error: `Cannot dispense "${medicineName}". Batch ${item.batchNumber} has expired`,
      });
    }

    if (item.quantityInStock < quantityToDispense) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock for "${medicineName}". Available: ${item.quantityInStock}, Requested: ${quantityToDispense}`,
      });
    }

    // Deduct stock
    item.quantityInStock -= quantityToDispense;
    await item.save();

    res.status(200).json({
      success: true,
      message: `${quantityToDispense} units of "${medicineName}" dispensed successfully`,
      remainingStock: item.quantityInStock,
      totalCost: quantityToDispense * item.unitPrice,
    });
  } catch (error) {
    console.error("Dispense medicine error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// 3. Get all stock items for a hospital
exports.getInventory = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const inventory = await PharmacyItem.find({ hospitalId }).sort({ medicineName: 1 });

    res.status(200).json({
      success: true,
      count: inventory.length,
      inventory,
    });
  } catch (error) {
    console.error("Fetch inventory error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};