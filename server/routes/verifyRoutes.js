
// routes/verifyRoutes.js
import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Helper function to validate URLs
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * @route POST /api/verify/submit
 * @desc Submit driver verification documents
 * @access Private (Firebase Auth required)
 */
router.post("/submit", verifyFirebaseToken, async (req, res) => {
  try {
    const { idProofUrl, licenseUrl, rcBookUrl, profilePhotoUrl } = req.body;

    // Validate inputs
    if (!idProofUrl || !licenseUrl || !rcBookUrl || !profilePhotoUrl) {
      return res.status(400).json({ 
        error: "All document URLs must be provided.",
        missing: [
          !idProofUrl && 'idProofUrl',
          !licenseUrl && 'licenseUrl', 
          !rcBookUrl && 'rcBookUrl',
          !profilePhotoUrl && 'profilePhotoUrl'
        ].filter(Boolean)
      });
    }

    // Validate URL formats
    const urls = { idProofUrl, licenseUrl, rcBookUrl, profilePhotoUrl };
    const invalidUrls = [];
    
    for (const [key, url] of Object.entries(urls)) {
      if (!isValidUrl(url)) {
        invalidUrls.push(key);
      }
    }
    
    if (invalidUrls.length > 0) {
      return res.status(400).json({ 
        error: "Invalid URL formats detected.",
        invalidFields: invalidUrls
      });
    }

    // Find user by Firebase UID
    const user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found. Please ensure your profile is set up correctly." });
    }

    // Check if already verified
    if (user.driverVerification?.isVerified) {
      return res.status(400).json({ 
        error: "You are already verified.",
        isVerified: true
      });
    }

    // Update verification details
    user.driverVerification = {
      documents: {
        idProofUrl,
        licenseUrl,
        rcBookUrl,
        profilePhotoUrl,
      },
      isVerified: false, // Mark as pending verification
      submittedAt: new Date(),
      lastUpdated: new Date()
    };

    await user.save();

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
    
    return res.status(500).json({ 
      error: "Server error while submitting documents. Please try again later." 
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
      hasDocuments: !!verification.documents,
      status: verification.isVerified ? 'verified' : (verification.submittedAt ? 'pending' : 'not_submitted')
    });
  } catch (err) {
    console.error("❌ Error fetching verification status:", err);
    return res.status(500).json({ error: "Server error while fetching status." });
  }
});

export default router;
