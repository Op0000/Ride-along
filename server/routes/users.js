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

export default router