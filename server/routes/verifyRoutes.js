// routes/verifyRoutes.js
import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// POST /verify/submit
router.post("/submit", verifyFirebaseToken, async (req, res) => {
  const { idProofUrl, licenseUrl, rcBookUrl, profilePhotoUrl } = req.body;

  if (!idProofUrl || !licenseUrl || !rcBookUrl || !profilePhotoUrl) {
    return res.status(400).json({ error: "All document URLs must be provided." });
  }

  try {
    const user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.driverVerification = {
      documents: {
        idProofUrl,
        licenseUrl,
        rcBookUrl,
        profilePhotoUrl,
      },
      isVerified: false,
      submittedAt: new Date(),
    };

    await user.save();

    res.status(200).json({ message: "Verification documents submitted successfully." });
  } catch (err) {
    console.error("Driver verification error:", err);
    res.status(500).json({ error: "Server error while submitting documents." });
  }
});

export default router;
