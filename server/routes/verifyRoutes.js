// routes/verifyRoutes.js
import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

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
      return res.status(400).json({ error: "All document URLs must be provided." });
    }

    // Find user by Firebase UID
    const user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
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
    };

    await user.save();

    return res.status(200).json({
      message: "Verification documents submitted successfully.",
      driverVerification: user.driverVerification,
    });
  } catch (err) {
    console.error("❌ Driver verification error:", err);
    return res.status(500).json({ error: "Server error while submitting documents." });
  }
});

export default router;
