const  mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        uhid: {
            type: String,
            unique: true,
        },
        hospitalId: {
            type: String,
            required: true,
        },
        abhaNumber: {
        type: String,
        default: null, // e.g. "12-3456-7890-1234"
        },
        abhaAddress: {
        type: String,
        default: null, // e.g. "aarav@abdm"
        },
        isAbhaLinked: {
        type: Boolean,
        default: false,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Others"],
        },
        phone: {
            type: String,
            required: true,
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-","O+", "O-"],
        },
        address: {
            type: String,

        },
    },
    {
        timestamps: true,
    }
);
patientSchema.pre("save", async function () {
  if (this.uhid) return;
if (this.uhid) return;
  const count = await mongoose.model("Patient").countDocuments({
    hospitalId: this.hospitalId,
  });

  const nextNumber = String(count + 1).padStart(6, "0");

  this.uhid = `${this.hospitalId}-${nextNumber}`;
});
module.exports = mongoose.model("Patient", patientSchema);