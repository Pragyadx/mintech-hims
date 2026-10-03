const express = require('express');
const router = express.Router();
const NewBorn = require('../models/NewBorn');

// 1. Fetch all newborn registrations
router.get('/', async (req, res) => {
  try {
    const list = await NewBorn.find().sort({ registeredAt: -1 }).limit(50);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Register newborn
router.post('/register', async (req, res) => {
  try {
    const count = await NewBorn.countDocuments();
    const uhid = `NB-${Date.now().toString().slice(-4)}${count + 1}`;
    
    const newBorn = new NewBorn({
      ...req.body,
      uhid
    });
    await newBorn.save();
    res.status(201).json({ success: true, data: newBorn });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;