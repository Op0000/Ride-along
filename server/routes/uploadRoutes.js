
import express from 'express'
import multer from 'multer'
import User from '../models/User.js'

const router = express.Router()

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, and PDF files are allowed'), false)
    }
  }
})

// Upload verification documents
router.post('/verification', upload.fields([
  { name: 'licenseDocument', maxCount: 1 },
  { name: 'identityDocument', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    if (!req.files || (!req.files.licenseDocument && !req.files.identityDocument)) {
      return res.status(400).json({ error: 'At least one document is required' })
    }

    const user = await User.findOne({ uid: userId })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Initialize verification object if it doesn't exist
    if (!user.verification) {
      user.verification = {
        status: 'pending',
        documents: {}
      }
    }

    // Store documents as base64 in MongoDB
    if (req.files.licenseDocument) {
      const licenseFile = req.files.licenseDocument[0]
      user.verification.documents.licenseDocument = {
        data: licenseFile.buffer.toString('base64'),
        contentType: licenseFile.mimetype,
        filename: licenseFile.originalname,
        uploadedAt: new Date()
      }
    }

    if (req.files.identityDocument) {
      const identityFile = req.files.identityDocument[0]
      user.verification.documents.identityDocument = {
        data: identityFile.buffer.toString('base64'),
        contentType: identityFile.mimetype,
        filename: identityFile.originalname,
        uploadedAt: new Date()
      }
    }

    user.verification.status = 'pending'
    user.verification.submittedAt = new Date()

    await user.save()

    res.json({ 
      message: 'Documents uploaded successfully',
      verification: {
        status: user.verification.status,
        submittedAt: user.verification.submittedAt,
        documents: {
          licenseDocument: user.verification.documents.licenseDocument ? 'uploaded' : null,
          identityDocument: user.verification.documents.identityDocument ? 'uploaded' : null
        }
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 10MB allowed.' })
    }
    res.status(500).json({ error: 'Upload failed' })
  }
})

// Get uploaded document
router.get('/document/:userId/:documentType', async (req, res) => {
  try {
    const { userId, documentType } = req.params

    const user = await User.findOne({ uid: userId })
    if (!user || !user.verification || !user.verification.documents) {
      return res.status(404).json({ error: 'Document not found' })
    }

    const document = user.verification.documents[documentType]
    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    const buffer = Buffer.from(document.data, 'base64')
    
    res.set({
      'Content-Type': document.contentType,
      'Content-Disposition': `inline; filename="${document.filename}"`
    })
    
    res.send(buffer)

  } catch (error) {
    console.error('Error fetching document:', error)
    res.status(500).json({ error: 'Failed to fetch document' })
  }
})

export default router
