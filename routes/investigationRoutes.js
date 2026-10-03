const express = require('express');
const router = express.Router();
const InvestigationOrder = require('../models/InvestigationOrder');
const LabTestMaster = require('../models/LabTestMaster');

// 1. Get all booked orders / today's registry
router.get('/', async (req, res) => {
  try {
    const orders = await InvestigationOrder.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Fetch Hospital's Dynamic Test Catalog from MongoDB
router.get('/catalog', async (req, res) => {
  try {
    const tests = await LabTestMaster.find({ isActive: true }).sort({ testName: 1 });
    res.json({ success: true, data: tests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Allow Hospital to Add/Configure a Test in their Master Catalog
router.post('/catalog/add', async (req, res) => {
  try {
    const { testCode, testName, department, rate } = req.body;
    if (!testCode || !testName || rate === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Test Code, Test Name, and Rate are required.' 
      });
    }

    const existingTest = await LabTestMaster.findOne({ testCode: testCode.trim().toUpperCase() });
    if (existingTest) {
      return res.status(400).json({ 
        success: false, 
        error: `Test Code ${testCode} already exists.` 
      });
    }

    const newTest = new LabTestMaster({
      testCode: testCode.trim().toUpperCase(),
      testName: testName.trim(),
      department: department || 'PATHOLOGY',
      rate: Number(rate)
    });

    await newTest.save();
    res.status(201).json({ success: true, data: newTest });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Book Investigation Order
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