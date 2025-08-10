// routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js";

const router = express.Router();

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "driver_verification",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    resource_type: "auto"
  }
});

const upload = multer({ storage });

// Helper to extract url (multer-storage-cloudinary stores final url in file.path)
const fileUrl = (file) => file?.path || file?.url || file?.secure_url || null;

/**
 * POST /api/upload
 * Single file upload. Form field: file
 * Response: { success:true, url }
 */
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });
  return res.json({ success: true, url: fileUrl(req.file) });
});

/**
 * POST /api/upload/multi
 * Multi-file upload (idProof, license, rcBook, profilePhoto)
 * Use form-data with those 4 fields.
 * Response: { success:true, idProofUrl, licenseUrl, rcBookUrl, profilePhotoUrl }
 */
router.post("/multi", upload.fields([
  { name: "idProof", maxCount: 1 },
  { name: "license", maxCount: 1 },
  { name: "rcBook", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 }
]), (req, res) => {
  try {
    const files = req.files || {};
    const idProofUrl = fileUrl(files.idProof?.[0]);
    const licenseUrl = fileUrl(files.license?.[0]);
    const rcBookUrl = fileUrl(files.rcBook?.[0]);
    const profilePhotoUrl = fileUrl(files.profilePhoto?.[0]);

    if (!idProofUrl || !licenseUrl || !rcBookUrl || !profilePhotoUrl) {
      return res.status(400).json({ success: false, error: "All 4 files must be uploaded" });
    }

    return res.json({
      success: true,
      idProofUrl,
      licenseUrl,
      rcBookUrl,
      profilePhotoUrl
    });
  } catch (err) {
    console.error("Upload multi error:", err);
    return res.status(500).json({ success: false, error: "Upload failed" });
  }
});

export default router;
