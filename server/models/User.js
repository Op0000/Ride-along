import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  name: String,
  age: Number,
  gender: String,
  email: String,
  phone: String,
}, { timestamps: true })

export default mongoose.model('User', userSchema)
