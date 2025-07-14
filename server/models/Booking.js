import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  userId: { type: String, required: true }, // Firebase UID
  seatsBooked: { type: Number, required: true },
  contactPhone: { type: String }, // optional field
  bookedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Booking', bookingSchema)
