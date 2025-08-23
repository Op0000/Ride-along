import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import cors from "cors";

const router = express.Router();

// Enable CORS for user routes
router.use(cors({
  origin: ['http://localhost:5173', 'https://ride-along.xyz', 'https://www.ride-along.xyz'],
  credentials: true
}));

// Save user details
router.post('/save', async (req, res) => {
  try {
    const { uid, name, age, gender, phone, email } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }

    // Validate required fields
    if (!name || !age || !gender || !phone || !email) {
      return res.status(400).json({
        error: 'All fields (name, age, gender, phone, email) are required'
      });
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        error: 'Phone number must be exactly 10 digits'
      });
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    const user = await User.findOneAndUpdate(
      { uid },
      { name, age: parseInt(age), gender, phone, email },
      { new: true, upsert: true, runValidators: true }
    );

    console.log(`✅ User profile saved for UID: ${uid}`);
    res.json({
      message: 'Profile saved successfully',
      user: user
    });
  } catch (err) {
    console.error('Save user error:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.message
      });
    }

    res.status(500).json({
      error: 'Failed to save user profile',
      message: err.message
    });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const { name, age, gender, phone } = req.body;
    const uid = req.user.uid;

    // Validate required fields
    if (!name || !age || !gender || !phone) {
      return res.status(400).json({
        success: false,
        error: 'All fields (name, age, gender, phone) are required'
      });
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Phone number must be exactly 10 digits'
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          name: name.trim(),
          age: parseInt(age),
          gender: gender.trim(),
          phone: phone.trim()
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    console.log(`✅ Profile updated for user: ${uid}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        uid: updatedUser.uid,
        name: updatedUser.name,
        age: updatedUser.age,
        gender: updatedUser.gender,
        phone: updatedUser.phone,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Get user by UID
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid })
    res.json(user || {})
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Get document image by UID and document type
router.get('/:uid/document/:docType', async (req, res) => {
  try {
    const { uid, docType } = req.params;

    const validDocTypes = ['idProof', 'license', 'rcBook', 'profilePhoto'];
    if (!validDocTypes.includes(docType)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    const user = await User.findOne({ uid });
    if (!user || !user.driverVerification?.documents?.[docType]) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const document = user.driverVerification.documents[docType];

    if (!document.data || !document.contentType) {
      return res.status(404).json({ error: 'Document data not found' });
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(document.data, 'base64');

    res.set({
      'Content-Type': document.contentType,
      'Content-Length': buffer.length,
      'Content-Disposition': `inline; filename="${document.filename || 'document'}"`,
      'Cache-Control': 'public, max-age=31536000'
    });

    res.send(buffer);
  } catch (err) {
    console.error('Document serve error:', err);
    res.status(500).json({ error: 'Failed to retrieve document' });
  }
});

// Add a field to track if onboarding is completed
router.put('/onboarding-status', verifyFirebaseToken, async (req, res) => {
  try {
    const { completed } = req.body;
    const uid = req.user.uid;

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ success: false, error: 'Onboarding status must be a boolean.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { $set: { 'onboardingCompleted': completed, 'updatedAt': new Date() } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    console.log(`✅ Onboarding status updated to ${completed} for user: ${uid}`);
    res.json({
      success: true,
      message: 'Onboarding status updated successfully',
      user: {
        uid: updatedUser.uid,
        onboardingCompleted: updatedUser.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Onboarding status update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: 'Validation failed', message: error.message });
    }
    res.status(500).json({ success: false, message: 'Failed to update onboarding status', error: error.message });
  }
});

// Route to check if onboarding is completed
router.get('/onboarding-status', verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const user = await User.findOne({ uid }, 'onboardingCompleted');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    res.json({
      success: true,
      onboardingCompleted: user.onboardingCompleted || false // Default to false if not set
    });
  } catch (error) {
    console.error('Onboarding status check error:', error);
    res.status(500).json({ success: false, message: 'Failed to check onboarding status', error: error.message });
  }
});


export default router