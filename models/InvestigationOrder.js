const mongoose = require('mongoose');

const InvestigationOrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  uhid: { type: String, required: true },
  patientName: { type: String, required: true },
  gender: String,
  ageYears: Number,
  mobile: String,
  department: { type: String, default: 'PATHOLOGY' },
  consultant: String,
  rateList: { type: String, default: 'COMMON' },
  tests: [
    {
      testName: String,
      rate: Number,
      unit: { type: Number, default: 1 },
      amount: Number
    }
  ],
  totalAmount: Number,
  discount: { type: Number, default: 0 },
  waiveOff: { type: Number, default: 0 },
  deposit: Number,
  due: { type: Number, default: 0 },
  paymentMode: { type: String, default: 'Cash' },
  hospitalId: { type: String, default: 'HOSP01' },
  status: { type: String, enum: ['Pending', 'Sample Collected', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InvestigationOrder', InvestigationOrderSchema);