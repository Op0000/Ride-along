import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'

const router = express.Router()

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' })

// Load OAuth2 credentials
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH))

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

// Set access token manually (you must already have this)
oAuth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

// Drive instance
const drive = google.drive({ version: 'v3', auth: oAuth2Client })

// Upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: ['1axpMSq_WKfOxGpgQr-aDpY2BDkJw67j0']
    }

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path)
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink'
    })

    // Delete local temp file
    fs.unlinkSync(req.file.path)

    res.status(200).json({
      success: true,
      fileId: response.data.id,
      fileName: response.data.name,
      link: response.data.webViewLink
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Upload failed' })
  }
})

export default router
