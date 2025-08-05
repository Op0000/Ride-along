const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Setup Multer to store files temporarily
const upload = multer({ dest: 'uploads/' });

// Setup Google Auth using service account
const auth = new google.auth.GoogleAuth({
  keyFile: '/etc/secrets/credentials.json', // This is your Render secret
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// POST /upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    const response = await drive.files.create({
      requestBody: {
        name: req.file.originalname,
        mimeType: req.file.mimetype,
      },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(filePath),
      },
    });

    // Optional: delete temp file after upload
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      fileId: response.data.id,
      message: 'File uploaded to Google Drive 🚀',
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, error: 'Upload failed ❌' });
  }
});

module.exports = router;
