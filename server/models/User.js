import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  name: String,
  age: Number,
  gender: String,
  email: String,
  phone: String,

  driverVerification: {
    documents: {
      idProofUrl: { type: String },
      licenseUrl: { type: String },
      rcBookUrl: { type: String },
      profilePhotoUrl: { type: String },
    },
    isVerified: { type: Boolean, default: false },
    submittedAt: { type: Date },
  }
}, { timestamps: true })

export default mongoose.model('User', userSchema)
