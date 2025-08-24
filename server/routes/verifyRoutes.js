import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import cors from "cors";

const router = express.Router();

// Enable CORS for verify routes
router.use(cors({
  origin: ['http://localhost:5173', 'https://ride-along.xyz', 'https://www.ride-along.xyz'],
  credentials: true
}));

/**
 * @route POST /api/verify/submit
 * @desc Submit driver verification documents
 * @access Private (Firebase Auth required)
 */
router.post("/submit", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, idProof, license, rcBook, profilePhoto } = req.body;

    if (!uid || !idProof || !license || !rcBook || !profilePhoto) {
      return res.status(400).json({
        error: 'Missing required fields: uid and all document files are required'
      });
    }

    // Validate that each document has required properties
    const requiredDocProps = ['data', 'contentType', 'filename'];
    const documents = { idProof, license, rcBook, profilePhoto };

    for (const [docName, doc] of Object.entries(documents)) {
      for (const prop of requiredDocProps) {
        if (!doc[prop]) {
          return res.status(400).json({
            error: `Invalid ${docName}: missing ${prop}`
          });
        }
      }
    }

    // Check if user exists first
    let user = await User.findOne({ uid });
    if (!user) {
      return res.status(400).json({ 
        error: "User not found. Please complete your profile setup first before submitting verification documents." 
      });
    }

    // Update user verification data
    user = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          'driverVerification.documents.idProof': idProof,
          'driverVerification.documents.license': license,
          'driverVerification.documents.rcBook': rcBook,
          'driverVerification.documents.profilePhoto': profilePhoto,
          'driverVerification.submittedAt': new Date(),
          'driverVerification.isVerified': false
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(500).json({ error: "Failed to update user verification data." });
    }

    console.log(`✅ Verification documents submitted for user: ${req.user.uid}`);

    return res.status(200).json({
      success: true,
      message: "Verification documents submitted successfully. Your documents are under review.",
      driverVerification: {
        isVerified: false,
        submittedAt: user.driverVerification.submittedAt,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error("❌ Driver verification error:", err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to submit verification',
      error: err.message
    });
  }
});

/**
 * @route GET /api/verify/status
 * @desc Get verification status for current user
 * @access Private (Firebase Auth required)
 */
router.get("/status", verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const verification = user.driverVerification || {
      isVerified: false,
      submittedAt: null,
      documents: null
    };

    return res.json({
      isVerified: verification.isVerified,
      submittedAt: verification.submittedAt,
      hasDocuments: !!verification.documents && Object.keys(verification.documents).some(key => verification.documents[key]),
      status: verification.isVerified ? 'verified' : (verification.submittedAt ? 'pending' : 'not_submitted')
    });
  } catch (err) {
    console.error("❌ Error fetching verification status:", err);
    return res.status(500).json({ error: "Server error while fetching status." });
  }
});

/**
 * @route PUT /api/verify/admin/:uid
 * @desc Admin route to verify/unverify users
 * @access Private (Firebase Auth required)
 */
router.put("/admin/:uid", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== 'boolean') {
      return res.status(400).json({ error: 'isVerified must be a boolean value' });
    }

    // Update both verification systems for compatibility
    const updateData = {
      'driverVerification.isVerified': isVerified,
      'verification.status': isVerified ? 'approved' : 'pending'
    };

    const user = await User.findOneAndUpdate(
      { uid },
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      user: {
        uid: user.uid,
        name: user.name,
        isVerified: user.driverVerification?.isVerified || (user.verification?.status === 'approved') || false
      }
    });
  } catch (err) {
    console.error("❌ Admin verification error:", err);
    return res.status(500).json({ error: "Server error while updating verification status." });
  }
});

/**
 * @route GET /api/verify/admin/all
 * @desc Get all users for admin verification
 * @access Private (Firebase Auth required)
 */
router.get("/admin/all", verifyFirebaseToken, async (req, res) => {
  try {
    // Find users with either verification.submittedAt or driverVerification.submittedAt
    const users = await User.find({
      $or: [
        { 'verification.submittedAt': { $exists: true } },
        { 'driverVerification.submittedAt': { $exists: true } }
      ]
    }).select('uid name email verification driverVerification');

    return res.json({
      success: true,
      users: users.map(user => {
        // Check both verification systems
        const verification = user.verification || {};
        const driverVerification = user.driverVerification || {};
        
        const isVerified = driverVerification.isVerified || 
                          (verification.status === 'approved') || false;
        const submittedAt = driverVerification.submittedAt || verification.submittedAt;
        
        return {
          uid: user.uid,
          name: user.name || 'No name',
          email: user.email || 'No email',
          isVerified: isVerified,
          submittedAt: submittedAt,
          hasDocuments: !!(verification.documents || driverVerification.documents)
        };
      })
    });
  } catch (err) {
    console.error("❌ Admin get users error:", err);
    return res.status(500).json({ error: "Server error while fetching users." });
  }
});

// New routes from the edited snippet:

// Get all pending verification requests (Admin only)
router.get('/pending', verifyFirebaseToken, async (req, res) => {
  try {
    const pendingUsers = await User.find({
      'driverVerification.isVerified': false, // Assuming 'pending' means not verified yet
      'driverVerification.submittedAt': { $exists: true }
    }).select('uid name email driverVerification.submittedAt'); // Selecting relevant fields

    res.json({
      success: true,
      users: pendingUsers.map(user => ({
        uid: user.uid,
        name: user.name || 'No name',
        email: user.email || 'No email',
        submittedAt: user.driverVerification?.submittedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
});

// Approve or reject verification (Admin only)
router.post('/update-status', verifyFirebaseToken, async (req, res) => {
  try {
    const { userId, status, adminNotes } = req.body;

    if (!userId || !status) {
      return res.status(400).json({ error: 'User ID and status are required' });
    }

    // Assuming 'approved' and 'rejected' are the only valid statuses for this endpoint
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const updateData = {
      'driverVerification.isVerified': status === 'approved', // Set isVerified based on status
      'driverVerification.reviewedAt': new Date() // Record when it was reviewed
    };

    if (adminNotes) {
      updateData['driverVerification.adminNotes'] = adminNotes;
    }

    const user = await User.findOneAndUpdate(
      { uid: userId },
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `Verification ${status} successfully`,
      user: {
        uid: user.uid,
        name: user.name,
        isVerified: user.driverVerification?.isVerified
      }
    });
  } catch (error) {
    console.error('Error updating verification status:', error);
    res.status(500).json({ error: 'Failed to update verification status' });
  }
});

// Get verification status for a specific user
router.get('/status/:userId', verifyFirebaseToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ uid: userId })
      .select('driverVerification'); // Select only the verification field

    if (!user || !user.driverVerification) { // Check if user or their verification exists
      return res.status(404).json({ error: 'User or verification data not found' });
    }

    const verification = user.driverVerification;

    res.json({
      isVerified: verification.isVerified,
      submittedAt: verification.submittedAt,
      status: verification.isVerified ? 'verified' : (verification.submittedAt ? 'pending' : 'not_submitted'),
      adminNotes: verification.adminNotes || null // Include admin notes if available
    });
  } catch (error) {
    console.error('Error fetching verification status:', error);
    res.status(500).json({ error: 'Failed to fetch verification status' });
  }
});

export default router