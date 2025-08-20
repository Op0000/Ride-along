
import mongoose from 'mongoose'

const RideSchema = new mongoose.Schema({
  driverName: { type: String, required: true },
  driverContact: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  car: { type: String, required: true },

  from: { type: String, required: true },
  to: { type: String, required: true },
  via: { type: [String] }, // optional

  price: { type: Number, required: true },
  pricePerKm: { type: Number, default: 8 },
  distance: { type: Number },
  seatsAvailable: { type: Number, required: true },
  departureTime: { type: Date, required: true },

  // Vehicle photos
  vehiclePhotos: [{
    data: String,
    contentType: String,
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // ✅ Firebase Auth User Info
  userId: { type: String, required: true },
  userEmail: { type: String, required: true }

}, { timestamps: true })

export default mongoose.model('Ride', RideSchema)
