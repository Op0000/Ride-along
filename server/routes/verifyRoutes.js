
<old_str>// routes/verifyRoutes.js
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

// Helper function to validate URLs - This function is no longer used in this route.
// const isValidUrl = (string) => {
//   try {
//     new URL(string);
//     return true;
//   } catch (_) {
//     return false;
//   }
// };

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

    const user = await User.findOneAndUpdate(
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
      { new: true, upsert: true }
    );

    // If user was not found and upsert created a new one, this is an error scenario.
    // However, findOneAndUpdate with upsert:true should handle existing users.
    // We check if the user object is actually updated or created, it should always be present after upsert.
    if (!user) {
      // This case might be rare with upsert, but good to have a fallback.
      return res.status(500).json({ error: "Failed to update or create user verification data." });
    }

    console.log(`✅ Verification documents submitted for user: ${req.user.uid}`);

    return res.status(200).json({
      message: "Verification documents submitted successfully. Your documents are under review.",
      driverVerification: {
        isVerified: false,
        submittedAt: user.driverVerification.submittedAt,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error("❌ Driver verification error:", err);

    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: "Invalid data format.",
        details: err.message
      });
    }

    // General server error handling
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
    // Find user by Firebase UID
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
      hasDocuments: !!verification.documents && Object.keys(verification.documents).some(key => verification.documents[key]), // Check if any document data exists
      status: verification.isVerified ? 'verified' : (verification.submittedAt ? 'pending' : 'not_submitted')
    });
  } catch (err) {
    console.error("❌ Error fetching verification status:", err);
    return res.status(500).json({ error: "Server error while fetching status." });
  }
});

export default router;</old_str>
<new_str>// routes/verifyRoutes.js
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

    const user = await User.findOneAndUpdate(
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
      { new: true, upsert: true }
    );

    if (!user) {
      return res.status(500).json({ error: "Failed to update or create user verification data." });
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

    const user = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          'driverVerification.isVerified': isVerified
        }
      },
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
        isVerified: user.driverVerification?.isVerified || false
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
    const users = await User.find({
      'driverVerification.submittedAt': { $exists: true }
    }).select('uid name email driverVerification.isVerified driverVerification.submittedAt');

    return res.json({
      success: true,
      users: users.map(user => ({
        uid: user.uid,
        name: user.name || 'No name',
        email: user.email || 'No email',
        isVerified: user.driverVerification?.isVerified || false,
        submittedAt: user.driverVerification?.submittedAt
      }))
    });
  } catch (err) {
    console.error("❌ Admin get users error:", err);
    return res.status(500).json({ error: "Server error while fetching users." });
  }
});

export default router;</new_str>
