import mongoose from 'mongoose'

const RideSchema = new mongoose.Schema({
  driverName: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  via: { type: [String] }, // optional
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
  departureTime: { type: Date, required: true }
}, { timestamps: true })

export default mongoose.model('Ride', RideSchema)
