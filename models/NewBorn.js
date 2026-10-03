const mongoose = require('mongoose');

const NewBornSchema = new mongoose.Schema({
  uhid: { type: String, required: true },
  babyName: { type: String, required: true },
  parentName: { type: String, default: '' },
  parentRelation: { type: String, default: 'Mr.' },
  mobile: { type: String, required: true },
  dob: { type: String, required: true },
  birthTime: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  bloodGroup: { type: String, default: '' },
  lengthInch: { type: Number, default: 0 },
  weightKg: { type: Number, default: 0 },
  headCircumferenceInch: { type: Number, default: 0 },
  birthType: { type: String, enum: ['NVD', 'LSCS', 'Forceps', 'Vacuum'], default: 'NVD' },
  consultantDr: { type: String, default: 'SELF' },
  address: { type: String, default: '' },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NewBorn', NewBornSchema);