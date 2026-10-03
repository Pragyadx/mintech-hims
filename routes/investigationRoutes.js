const express = require('express');
const router = express.Router();
const InvestigationOrder = require('../models/InvestigationOrder');

// Get all orders / today's registry
router.get('/', async (req, res) => {
  try {
    const orders = await InvestigationOrder.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Book Investigation Order
router.post('/book', async (req, res) => {
  try {
    const count = await InvestigationOrder.countDocuments();
    const orderId = `INV-${Date.now().toString().slice(-4)}${count + 1}`;
    
    const newOrder = new InvestigationOrder({
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