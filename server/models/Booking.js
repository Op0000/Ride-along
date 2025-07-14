import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  userId: { type: String, required: true }, // Firebase UID
  userEmail: { type: String, required: true },
  userName: { type: String },
  userPhone: { type: String },
  userAge: { type: Number },
  userGender: { type: String },
  seatsBooked: { type: Number, required: true, default: 1 },
  bookedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Booking', bookingSchema)
