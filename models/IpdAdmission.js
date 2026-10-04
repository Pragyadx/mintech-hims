const mongoose = require('mongoose');

const IpdAdmissionSchema = new mongoose.Schema({
  ipdNumber: { type: String, required: true, unique: true }, // e.g. IPD-2610-001
  uhid: { type: String, required: true },
  abhaNumber: { type: String, default: '' },
  patientName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  ageYears: { type: Number, default: 0 },
  maritalStatus: { type: String, default: 'Single' },
  mobile: { type: String, required: true },
  guardianName: { type: String, default: '' },
  guardianRelation: { type: String, default: '' },
  guardianMobile: { type: String, default: '' },
  occupation: { type: String, default: 'Self Employed' },
  religion: { type: String, default: 'Hindu' },
  address: { type: String, default: '' },
  bloodGroup: { type: String, default: 'NA' },
  department: { type: String, required: true },
  consultantDoctor: { type: String, required: true },
  referredBy: { type: String, default: 'SELF' },
  provisionalDiagnosis: { type: String, default: '' },
  icdCode: { type: String, default: '' },
  // Payer / Insurance
  insuranceCo: { type: String, default: '' },
  policyNumber: { type: String, default: '' },
  billingMode: { type: String, enum: ['Cash', 'Credit'], default: 'Cash' },
  // Bed & Admission
  arrivalDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  arrivalTime: { type: String, default: () => new Date().toLocaleTimeString() },
  wardCategory: { type: String, required: true }, // GENERAL WARD, ICU, etc.
  bedNumber: { type: String, required: true },
  fileCharge: { type: Number, default: 100 },
  admissionType: { type: String, enum: ['Planned', 'Daycare', 'Emergency'], default: 'Planned' },
  isMlc: { type: Boolean, default: false },
  source: { type: String, default: 'WALK-IN' },
  advanceDeposit: { type: Number, default: 0 },
  status: { type: String, enum: ['Admitted', 'Discharged', 'Transferred'], default: 'Admitted' },
  admittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IpdAdmission', IpdAdmissionSchema);