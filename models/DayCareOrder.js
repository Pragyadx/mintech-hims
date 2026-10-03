const mongoose = require('mongoose');

const DayCareOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  uhid: { type: String, required: true },
  patientName: { type: String, required: true },
  gender: { type: String, default: 'Male' },
  ageYears: { type: Number, default: 0 },
  mobile: { type: String, required: true },
  department: { type: String, default: 'DAY CARE' },
  consultant: { type: String, default: 'SELF' },
  rateList: { type: String, default: 'COMMON' },
  panel: { type: String, default: '--NA--' },
  cardNo: { type: String, default: '' },
  serviceNo: { type: String, default: '' },
  rank: { type: String, default: '' },
  abhaNo: { type: String, default: '' },
  address: { type: String, default: '' },
  services: [
    {
      serviceCode: String,
      serviceName: String,
      rate: Number,
      quantity: { type: Number, default: 1 },
      amount: Number
    }
  ],
  totalAmount: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  waiveOff: { type: Number, default: 0 },
  deposit: { type: Number, default: 0 },
  due: { type: Number, default: 0 },
  paymentMode: { type: String, default: 'Cash' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DayCareOrder', DayCareOrderSchema);