import express from 'express'
import User from '../models/User.js'

const router = express.Router()

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

export default router