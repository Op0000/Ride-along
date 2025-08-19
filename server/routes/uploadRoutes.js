
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
    folder: process.env.CLOUDINARY_FOLDER || "driver_verification",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    resource_type: "auto",
    transformation: [
      { width: 1000, height: 1000, crop: "limit", quality: "auto" }
    ]
  }
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPG, PNG, and PDF files are allowed.`), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Helper to extract url (multer-storage-cloudinary stores final url in file.path)
const fileUrl = (file) => file?.path || file?.url || file?.secure_url || null;

/**
 * POST /api/upload
 * Single file upload. Form field: file
 * Response: { success:true, url }
 */
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }
    return res.json({ success: true, url: fileUrl(req.file) });
  } catch (error) {
    console.error("Single upload error:", error);
    return res.status(500).json({ success: false, error: "Upload failed" });
  }
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
    
    // Check if all required files are present
    const requiredFields = ['idProof', 'license', 'rcBook', 'profilePhoto'];
    const missingFields = requiredFields.filter(field => !files[field] || !files[field][0]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Missing required files: ${missingFields.join(', ')}` 
      });
    }
    
    const idProofUrl = fileUrl(files.idProof?.[0]);
    const licenseUrl = fileUrl(files.license?.[0]);
    const rcBookUrl = fileUrl(files.rcBook?.[0]);
    const profilePhotoUrl = fileUrl(files.profilePhoto?.[0]);

    // Double-check all URLs are valid
    if (!idProofUrl || !licenseUrl || !rcBookUrl || !profilePhotoUrl) {
      return res.status(500).json({ 
        success: false, 
        error: "Failed to process uploaded files" 
      });
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
    
    let errorMessage = "Upload failed";
    if (err.message.includes("Invalid file type")) {
      errorMessage = err.message;
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      errorMessage = "File too large. Maximum size is 5MB per file.";
    }
    
    return res.status(500).json({ success: false, error: errorMessage });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 5MB per file.'
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${error.message}`
    });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
});

export default router;
