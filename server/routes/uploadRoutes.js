
import express from "express";
import multer from "multer";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

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

// Helper function to convert buffer to base64
const bufferToBase64 = (buffer) => {
  return buffer.toString('base64');
};

/**
 * POST /api/upload
 * Single file upload. Form field: file
 * Response: { success:true, fileData }
 */
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const fileData = {
      data: bufferToBase64(req.file.buffer),
      contentType: req.file.mimetype,
      filename: req.file.originalname
    };

    return res.json({ success: true, fileData });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to upload file',
      error: error.message 
    });
  }
});

/**
 * POST /api/upload/multi
 * Multi-file upload (idProof, license, rcBook, profilePhoto)
 * Use form-data with those 4 fields.
 * Response: { success:true, idProof, license, rcBook, profilePhoto }
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

    const result = {};

    // Process each file
    requiredFields.forEach(field => {
      const file = files[field][0];
      result[field] = {
        data: bufferToBase64(file.buffer),
        contentType: file.mimetype,
        filename: file.originalname
      };
    });

    return res.json({
      success: true,
      ...result
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
