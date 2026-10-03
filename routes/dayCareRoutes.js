const express = require('express');
const router = express.Router();
const DayCareServiceMaster = require('../models/DayCareServiceMaster');
const DayCareOrder = require('../models/DayCareOrder');

// 1. Fetch Dynamic Day Care Procedures Catalog
router.get('/catalog', async (req, res) => {
  try {
    const list = await DayCareServiceMaster.find({ isActive: true }).sort({ serviceCode: 1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Add New Day Care Procedure to Hospital Master
router.post('/catalog/add', async (req, res) => {
  try {
    const { serviceCode, serviceName, rate, unitLabel } = req.body;
    if (!serviceCode || !serviceName || rate === undefined) {
      return res.status(400).json({ success: false, error: 'Code, Name, and Rate are required.' });
    }
    const item = new DayCareServiceMaster({
      serviceCode: serviceCode.trim().toUpperCase(),
      serviceName: serviceName.trim(),
      rate: Number(rate),
      unitLabel: unitLabel || 'Unit 1'
    });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Book Day Care Order
router.post('/book', async (req, res) => {
  try {
    const count = await DayCareOrder.countDocuments();
    const orderId = `DC-${Date.now().toString().slice(-4)}${count + 1}`;
    const newOrder = new DayCareOrder({
      ...req.body,
      orderId
    });
    await newOrder.save();
    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;