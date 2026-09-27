const express = require("express");
const router = express.Router();
const {
  addStock,
  dispenseMedicine,
  getInventory,
} = require("../controllers/pharmacyController");

// Add stock: POST /api/pharmacy/stock
router.post("/stock", addStock);

// Dispense medicine: POST /api/pharmacy/dispense
router.post("/dispense", dispenseMedicine);

// View full inventory: GET /api/pharmacy/inventory/:hospitalId
router.get("/inventory/:hospitalId", getInventory);

module.exports = router;