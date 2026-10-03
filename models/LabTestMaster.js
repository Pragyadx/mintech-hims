const mongoose = require('mongoose');

const LabTestMasterSchema = new mongoose.Schema({
  testCode: { type: String, required: true, unique: true },
  testName: { type: String, required: true },
  department: { type: String, default: 'PATHOLOGY' },
  rate: { type: Number, required: true, default: 0 },
  hospitalId: { type: String, default: 'HOSP01' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LabTestMaster', LabTestMasterSchema);