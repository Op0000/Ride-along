import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  userId: { type: String, required: true },
  seatsBooked: { type: Number, default: 1 },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  bookedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Booking', bookingSchema)
