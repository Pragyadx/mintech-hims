const mongoose = require('mongoose');

const opdVisitSchema = new mongoose.Schema({
  hospitalId: { type: String, default: 'HOSP01', index: true },
  tokenNo: { type: Number, required: true },
  opdId: { type: String, required: true, unique: true },
  uhid: { type: String, required: true, index: true },
  abhaNo: { type: String, default: '' },
  abhaAddress: { type: String, default: '' },
  registrationDate: { type: Date, default: Date.now },
  panelTpa: { type: String, default: '--NA--' },
  department: { type: String, required: true },
  patientTitle: { type: String, default: 'Mr.' },
  patientName: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  maritalStatus: { type: String, default: 'Single' },
  mobile: { type: String, required: true },
  email: { type: String, default: '' },
  
  // Doctor references (supports both name and id)
  doctor: { type: String, default: 'Dr. EMO' },
  doctorId: { type: String, default: 'Dr. EMO' },
  
  slot: { type: String, default: 'Slot I' },
  guardianRelation: { type: String, default: 'S/o' },
  guardianName: { type: String, default: '' },
  dob: { type: Date },
  ageYears: { type: Number, default: 0 },
  address: { type: String, default: '' },
  state: { type: String, default: 'Uttar Pradesh' },
  district: { type: String, default: 'Ghaziabad' },
  referredBy: { type: String, default: 'SELF' },
  type: { type: String, default: 'Gen' },
  fee: { type: Number, required: true, default: 100 },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  paymentMode: { type: String, default: 'Cash', enum: ['Cash', 'Online', 'Card', 'UPI'] },
  
  // Clinical / Consultation fields (Preserved from existing codebase)
  vitals: {
    bp: { type: String, default: '' },
    pulse: { type: Number },
    temperature: { type: Number },
    weight: { type: Number },
    sp02: { type: Number }
  },
  chiefComplaints: [{ type: String }],
  diagnosis: { type: String, default: '' },
  prescriptions: [
    {
      medicineName: { type: String },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      instructions: { type: String }
    }
  ],

  // Status covering both front desk and doctor workflows
  status: { 
    type: String, 
    default: 'Waiting', 
    enum: ['Waiting', 'Engaged', 'In-Consultation', 'Completed', 'Cancelled'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('OpdVisit', opdVisitSchema);