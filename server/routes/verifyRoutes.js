// routes/verifyRoutes.js
const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middlewares/firebaseAuth");
const User = require("../models/User");

router.post("/submit", verifyFirebaseToken, async (req, res) => {
  const { idProofUrl, licenseUrl, rcBookUrl, profilePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });

    if (!user) return res.status(404).json({ error: "User not found" });

    user.driverVerification = {
      documents: { idProofUrl, licenseUrl, rcBookUrl, profilePhotoUrl },
      isVerified: false,
      submittedAt: new Date(),
    };

    await user.save();
    res.json({ message: "Submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
