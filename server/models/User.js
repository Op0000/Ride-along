import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  age: { type: Number, default: null },
  gender: { type: String, default: '' },
  university: { type: String, default: '' },
  course: { type: String, default: '' },
  address: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relation: { type: String, default: '' }
  },
  averageRating: { type: Number, default: 0 },
  ridesTaken: { type: Number, default: 0 },
  ridesOffered: { type: Number, default: 0 },
  verification: {
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    documents: {
      licenseDocument: {
        data: String,
        contentType: String,
        filename: String,
        uploadedAt: Date
      },
      identityDocument: {
        data: String,
        contentType: String,
        filename: String,
        uploadedAt: Date
      }
    },
    submittedAt: Date,
    reviewedAt: Date,
    adminNotes: String
  },
  driverVerification: {
    isVerified: { type: Boolean, default: false },
    documents: {
      idProof: {
        data: String,
        contentType: String,
        filename: String,
        uploadedAt: { type: Date, default: Date.now }
      },
      license: {
        data: String,
        contentType: String,
        filename: String,
        uploadedAt: { type: Date, default: Date.now }
      },
      rcBook: {
        data: String,
        contentType: String,
        filename: String,
        uploadedAt: { type: Date, default: Date.now }
      },
      profilePhoto: {
        data: String,
        contentType: String,
        filename: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    },
    submittedAt: Date,
    reviewedAt: Date,
    adminNotes: String
  }
}, { timestamps: true })

export default mongoose.model('User', userSchema)