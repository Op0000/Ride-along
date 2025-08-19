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
      idProof: {
        data: { type: String }, // base64 string
        contentType: { type: String }, // mime type
        filename: { type: String }
      },
      license: {
        data: { type: String },
        contentType: { type: String },
        filename: { type: String }
      },
      rcBook: {
        data: { type: String },
        contentType: { type: String },
        filename: { type: String }
      },
      profilePhoto: {
        data: { type: String },
        contentType: { type: String },
        filename: { type: String }
      }
    },
    isVerified: { type: Boolean, default: false },
    submittedAt: { type: Date },
  }
}, { timestamps: true })

export default mongoose.model('User', userSchema)
