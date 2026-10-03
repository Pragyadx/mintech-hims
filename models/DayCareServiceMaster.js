const mongoose = require('mongoose');

const DayCareServiceMasterSchema = new mongoose.Schema({
  serviceCode: { type: String, required: true, unique: true }, // e.g. CASU-1, ECG-01
  serviceName: { type: String, required: true }, // e.g. CATHETERIZATION, ECG
  unitLabel: { type: String, default: 'Unit 1' },
  rate: { type: Number, required: true, default: 0 },
  department: { type: String, default: 'DAY CARE' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DayCareServiceMaster', DayCareServiceMasterSchema);