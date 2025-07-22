import mongoose from 'mongoose'

const liveLocationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  placeName: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  accuracy: {
    type: String,
    default: 'Unknown'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
  }
}, {
  timestamps: true
})

// Create index for automatic cleanup
liveLocationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// SessionId index is already created with the unique constraint above

// Create index for userId lookup
liveLocationSchema.index({ userId: 1 })

export default mongoose.model('LiveLocation', liveLocationSchema)