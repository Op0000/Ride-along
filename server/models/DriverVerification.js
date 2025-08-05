// models/DriverVerification.js
import mongoose from 'mongoose'

const driverVerificationSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  documentUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
})

export default mongoose.model('DriverVerification', driverVerificationSchema)
