
import { useState } from 'react'
import { getAuth } from 'firebase/auth'
import { API_BASE } from '../utils/api.js'

export default function VerificationForm() {
  const auth = getAuth()
  const user = auth.currentUser

  const [documents, setDocuments] = useState({
    licenseDocument: null,
    identityDocument: null,
    vehiclePhoto: null
  })
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result.split(',')[1] // Remove data:image/jpeg;base64, prefix
        resolve({
          data: base64,
          contentType: file.type,
          filename: file.name,
          size: file.size
        })
      }
      reader.onerror = reject
    })
  }

  const handleFileSelect = (docType, file) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB')
        return
      }
      setDocuments(prev => ({ ...prev, [docType]: file }))
      setError('')
    } else {
      setError('Please select a valid image file (JPG, PNG) or PDF')
    }
  }

  const handleDrag = (e, docType) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [docType]: true }))
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [docType]: false }))
    }
  }

  const handleDrop = (e, docType) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(prev => ({ ...prev, [docType]: false }))

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(docType, e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!user) {
      setError('Please log in to submit verification documents')
      return
    }

    // Check if all documents are selected
    if (!documents.licenseDocument || !documents.identityDocument || !documents.vehiclePhoto) {
      setError('Please select all required documents')
      return
    }

    setUploading(true)

    try {
      // Get Firebase ID token
      const token = await user.getIdToken()

      // Convert files to base64
      const licenseDocument = await convertFileToBase64(documents.licenseDocument)
      const identityDocument = await convertFileToBase64(documents.identityDocument)
      const vehiclePhoto = await convertFileToBase64(documents.vehiclePhoto)

      // Send to server
      const response = await fetch(`${API_BASE}/api/verify/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: user.uid,
          licenseDocument,
          identityDocument,
          vehiclePhoto
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Upload failed')
      }

      if (data.success) {
        setSuccess('✅ Verification documents submitted successfully! Your documents are under review.')
        // Reset form
        setDocuments({
          licenseDocument: null,
          identityDocument: null,
          vehiclePhoto: null
        })
        // Clear file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]')
        fileInputs.forEach(input => input.value = '')
        
        // Refresh page after delay to show updated verification status
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        throw new Error(data.error || 'Upload failed')
      }

    } catch (error) {
      console.error('Verification submission error:', error)
      setError(`❌ Error: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const documentLabels = {
    licenseDocument: 'Driving License',
    identityDocument: 'ID Proof (Aadhar/PAN/Passport)',
    vehiclePhoto: 'Vehicle Photo'
  }

  const renderFileUpload = (docType) => (
    <div key={docType} className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {documentLabels[docType]} *
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive[docType] 
            ? 'border-purple-400 bg-purple-900 bg-opacity-20' 
            : documents[docType] 
              ? 'border-green-400 bg-green-900 bg-opacity-20'
              : 'border-gray-600 hover:border-purple-400'
        }`}
        onDragEnter={(e) => handleDrag(e, docType)}
        onDragOver={(e) => handleDrag(e, docType)}
        onDragLeave={(e) => handleDrag(e, docType)}
        onDrop={(e) => handleDrop(e, docType)}
        onClick={() => document.getElementById(`file-${docType}`).click()}
      >
        <input
          type="file"
          id={`file-${docType}`}
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => e.target.files[0] && handleFileSelect(docType, e.target.files[0])}
        />

        {documents[docType] ? (
          <div className="text-green-400">
            <div className="text-2xl mb-2">✓</div>
            <div className="text-sm font-medium">{documents[docType].name}</div>
            <div className="text-xs text-gray-400">
              {Math.round(documents[docType].size / 1024)} KB
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setDocuments(prev => ({ ...prev, [docType]: null }))
              }}
              className="mt-2 text-red-400 hover:text-red-300 text-xs underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-gray-400">
            <div className="text-3xl mb-2">📁</div>
            <div className="text-sm">
              <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                Click to select
              </span>
              <span> or drag file here</span>
            </div>
            <div className="text-xs mt-1">Max 5MB • JPG, PNG, PDF</div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="bg-zinc-700 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-purple-300 mb-4">
        Driver Verification Documents
      </h3>

      <form onSubmit={handleSubmit}>
        {Object.keys(documentLabels).map(renderFileUpload)}

        {error && (
          <div className="text-red-400 text-sm mb-4 p-3 bg-red-900 bg-opacity-20 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-400 text-sm mb-4 p-3 bg-green-900 bg-opacity-20 rounded">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !documents.licenseDocument || !documents.identityDocument || !documents.vehiclePhoto}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {uploading ? 'Uploading...' : 'Submit Documents'}
        </button>
      </form>
    </div>
  )
}
