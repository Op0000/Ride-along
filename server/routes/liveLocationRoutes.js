import express from 'express'
import LiveLocation from '../models/LiveLocation.js'

const router = express.Router()

// Create or update live location session
router.post('/', async (req, res) => {
  try {
    const {
      sessionId,
      userId,
      userName,
      userEmail,
      location,
      placeName,
      message,
      accuracy
    } = req.body

    // Validate required fields
    if (!sessionId || !userId || !userName || !userEmail || !location || !location.lat || !location.lng) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: sessionId, userId, userName, userEmail, location'
      })
    }

    // Check if session already exists
    let liveLocationSession = await LiveLocation.findOne({ sessionId })

    if (liveLocationSession) {
      // Update existing session
      liveLocationSession.location = location
      liveLocationSession.placeName = placeName || liveLocationSession.placeName
      liveLocationSession.message = message || liveLocationSession.message
      liveLocationSession.accuracy = accuracy || liveLocationSession.accuracy
      liveLocationSession.lastUpdated = new Date()
      liveLocationSession.isActive = true

      await liveLocationSession.save()

      console.log(`📍 Updated live location for session: ${sessionId}`)
    } else {
      // Create new session
      liveLocationSession = new LiveLocation({
        sessionId,
        userId,
        userName,
        userEmail,
        location,
        placeName: placeName || '',
        message: message || '',
        accuracy: accuracy || 'Unknown'
      })

      await liveLocationSession.save()

      console.log(`📍 Created new live location session: ${sessionId}`)
    }

    res.json({
      success: true,
      message: 'Live location session updated successfully',
      sessionId: liveLocationSession.sessionId,
      shareableUrl: `${req.protocol}://${req.get('host')}/live-location/${sessionId}`
    })

  } catch (error) {
    console.error('❌ Error handling live location:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update live location session',
      error: error.message
    })
  }
})

// Get live location by session ID
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    const liveLocationSession = await LiveLocation.findOne({
      sessionId,
      isActive: true
    })

    if (!liveLocationSession) {
      return res.status(404).json({
        success: false,
        message: 'Live location session not found or expired'
      })
    }

    // Check if session is still valid (not older than 24 hours)
    const now = new Date()
    const sessionAge = now - liveLocationSession.lastUpdated
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    if (sessionAge > maxAge) {
      // Mark as inactive
      liveLocationSession.isActive = false
      await liveLocationSession.save()

      return res.status(404).json({
        success: false,
        message: 'Live location session has expired'
      })
    }

    console.log(`📍 Retrieved live location for session: ${sessionId}`)

    res.json({
      success: true,
      data: {
        sessionId: liveLocationSession.sessionId,
        userName: liveLocationSession.userName,
        userEmail: liveLocationSession.userEmail,
        location: liveLocationSession.location,
        placeName: liveLocationSession.placeName,
        message: liveLocationSession.message,
        accuracy: liveLocationSession.accuracy,
        startTime: liveLocationSession.startTime,
        lastUpdated: liveLocationSession.lastUpdated
      }
    })

  } catch (error) {
    console.error('❌ Error retrieving live location:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve live location session',
      error: error.message
    })
  }
})

// Stop live location sharing
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { userId } = req.body

    const liveLocationSession = await LiveLocation.findOne({ sessionId })

    if (!liveLocationSession) {
      return res.status(404).json({
        success: false,
        message: 'Live location session not found'
      })
    }

    // Verify user owns this session
    if (liveLocationSession.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only stop your own live location sessions'
      })
    }

    // Mark as inactive instead of deleting for audit purposes
    liveLocationSession.isActive = false
    liveLocationSession.lastUpdated = new Date()
    await liveLocationSession.save()

    console.log(`📍 Stopped live location session: ${sessionId}`)

    res.json({
      success: true,
      message: 'Live location sharing stopped successfully'
    })

  } catch (error) {
    console.error('❌ Error stopping live location:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to stop live location session',
      error: error.message
    })
  }
})

// Get user's active live location sessions
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const activeSessions = await LiveLocation.find({
      userId,
      isActive: true
    }).sort({ lastUpdated: -1 })

    res.json({
      success: true,
      data: activeSessions.map(session => ({
        sessionId: session.sessionId,
        location: session.location,
        placeName: session.placeName,
        message: session.message,
        startTime: session.startTime,
        lastUpdated: session.lastUpdated,
        shareableUrl: `${req.protocol}://${req.get('host')}/live-location/${session.sessionId}`
      }))
    })

  } catch (error) {
    console.error('❌ Error retrieving user live locations:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user live location sessions',
      error: error.message
    })
  }
})

// Health check endpoint
router.get('/health/check', (req, res) => {
  res.json({
    success: true,
    message: 'Live location service is operational',
    timestamp: new Date().toISOString()
  })
})

export default router