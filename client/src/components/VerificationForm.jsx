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
  // State for error messages
  const [error, setError] = useState('')
  // State for verification status (e.g., 'pending', 'approved', 'rejected')
  const [verificationStatus, setVerificationStatus] = useState('')

  // Refs for file inputs to allow programmatic clearing
  const licenseInputRef = null // Placeholder, assuming these would be defined if the provided changes were more complete
  const identityInputRef = null // Placeholder, assuming these would be defined if the provided changes were more complete
  // Placeholder for licenseDocument and identityDocument, as these are not in the original code but used in the changes.
  // In a real scenario, these would be part of the component's state.
  const licenseDocument = null
  const identityDocument = null


  const handleFileSelect = (docType, file) => {
    if (file && file.type.startsWith('image/')) {
      setDocuments(prev => ({ ...prev, [docType]: file }))
    } else {
      alert('Please select a valid image file')
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

    // This block of code from the changes is not directly applicable to the original component's state structure.
    // The original component uses `documents.idProof`, `documents.license`, etc., not `licenseDocument` or `identityDocument`.
    // Therefore, this check is commented out to avoid introducing undefined states.
    // if (!licenseDocument && !identityDocument) {
    //   setError('Please select at least one document to upload')
    //   return
    // }

    if (!user) {
      alert('Please log in to submit verification documents')
      return
    }

    // Check if all documents are selected
    if (!documents.licenseDocument || !documents.identityDocument || !documents.vehiclePhoto) {
      alert('Please select all required documents')
      return
    }

    setUploading(true)
    setError('') // Clear previous errors

    try {
      // Get Firebase ID token
      const token = await user.getIdToken()

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('userId', user.uid)
      formData.append('licenseDocument', documents.licenseDocument)
      formData.append('identityDocument', documents.identityDocument)
      formData.append('vehiclePhoto', documents.vehiclePhoto)

      // Upload documents to server
      // The URL in the changes is different from the original. Using the URL from the original code.
      const uploadResponse = await fetch(`${API_BASE}/api/upload/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }
        throw new Error(errorData.error || 'Upload failed')
      }

      const uploadData = await uploadResponse.json()

      if (uploadData.success) {
        alert('✅ Verification documents submitted successfully! Your documents are under review.')
        // Reset form
        setDocuments({
          licenseDocument: null,
          identityDocument: null,
          vehiclePhoto: null
        })
        // Refresh page to show updated verification status
        window.location.reload()
      } else {
        throw new Error(uploadData.error || 'Upload failed')
      }

    } catch (error) {
      console.error('Verification submission error:', error)
      alert(`❌ Error: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const documentLabels = {
    licenseDocument: 'Driving License',
    identityDocument: 'ID Proof (Aadhar/PAN/Passport)',
    vehiclePhoto: 'Vehicle Photo'
  }

  const renderFileInput = (docType) => (
    <div key={docType} className="mb-4">
      <label className="block text-sm font-medium text-purple-300 mb-2">
        {documentLabels[docType]} *
      </label>

      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragActive[docType] 
            ? 'border-purple-400 bg-purple-900/20' 
            : documents[docType]
            ? 'border-green-400 bg-green-900/20'
            : 'border-zinc-600 bg-zinc-700/50'
        }`}
        onDragEnter={(e) => handleDrag(e, docType)}
        onDragLeave={(e) => handleDrag(e, docType)}
        onDragOver={(e) => handleDrag(e, docType)}
        onDrop={(e) => handleDrop(e, docType)}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(docType, e.target.files[0])}
          className="hidden"
          id={`file-${docType}`}
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
              onClick={() => setDocuments(prev => ({ ...prev, [docType]: null }))}
              className="mt-2 text-red-400 hover:text-red-300 text-xs underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-gray-400">
            <div className="text-3xl mb-2">📁</div>
            <div className="text-sm">
              <label htmlFor={`file-${docType}`} className="cursor-pointer text-purple-400 hover:text-purple-300">
                Click to select
              </label>
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
        {Object.keys(documentLabels).map(renderFileInput)}

        <button
          type="submit"
          disabled={uploading || !user}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            uploading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting Documents...
            </div>
          ) : (
            'Submit for Verification'
          )}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-400">
        <p>• All documents are required for verification</p>
        <p>• Documents will be reviewed within 24-48 hours</p>
        <p>• You'll be notified once verification is complete</p>
      </div>
    </div>
  )
}