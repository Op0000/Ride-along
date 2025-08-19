
import React, { useState } from "react";
import axios from "axios";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

export default function VerificationForm() {
  const [files, setFiles] = useState({
    idProof: null,
    license: null,
    rcBook: null,
    profilePhoto: null,
  });
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileLabels = {
    idProof: "ID Proof",
    license: "Driving License",
    rcBook: "RC Book",
    profilePhoto: "Profile Photo",
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];
    
    // Validate file type and size
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        alert(`❌ Invalid file type for ${fileLabels[name]}. Please upload JPG, PNG, or PDF files only.`);
        return;
      }
      
      if (file.size > maxSize) {
        alert(`❌ File too large for ${fileLabels[name]}. Maximum size is 5MB.`);
        return;
      }
    }
    
    setFiles((prev) => ({ ...prev, [name]: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAllFiles = async () => {
    const formData = new FormData();
    formData.append("idProof", files.idProof);
    formData.append("license", files.license);
    formData.append("rcBook", files.rcBook);
    formData.append("profilePhoto", files.profilePhoto);
    
    const res = await axios.post("/api/upload/multi", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percent);
      },
    });
    return res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all files are selected
    const requiredFiles = ['idProof', 'license', 'rcBook', 'profilePhoto'];
    const missingFiles = requiredFiles.filter(key => !files[key]);
    
    if (missingFiles.length > 0) {
      alert(`❌ Please upload all required documents: ${missingFiles.map(key => fileLabels[key]).join(', ')}`);
      return;
    }
    
    setLoading(true);
    setProgress(0);

    try {
      // Upload all files at once
      const uploadResult = await uploadAllFiles();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }
      
      const { idProofUrl, licenseUrl, rcBookUrl, profilePhotoUrl } = uploadResult;

      // Send to verification API
      await axios.post(
        "/api/verify/submit",
        { idProofUrl, licenseUrl, rcBookUrl, profilePhotoUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("✅ Documents submitted successfully! Your verification is pending review.");
      
      // Reset form
      setFiles({
        idProof: null,
        license: null,
        rcBook: null,
        profilePhoto: null,
      });
      setPreviews({});
      
      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');
      
    } catch (err) {
      console.error('Verification submission error:', err);
      
      let errorMessage = 'Unknown error occurred';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-purple-300 text-center">
        Driver Verification
      </h2>
      <p className="text-sm text-gray-300 text-center">
        Upload your documents to get verified and start posting rides.
      </p>

      {Object.keys(fileLabels).map((key) => (
        <div key={key} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-200">
            {fileLabels[key]} <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-3">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-400/10 transition">
              <CloudArrowUpIcon className="w-8 h-8 text-purple-300" />
              <span className="text-xs text-gray-300">Click or drag file</span>
              <span className="text-xs text-gray-400">(JPG, PNG, PDF - Max 5MB)</span>
              <input
                type="file"
                name={key}
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                required
              />
            </label>
            {previews[key] && (
              <img
                src={previews[key]}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg border border-gray-500"
              />
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-purple-500 h-2.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? `Uploading ${progress}%` : "Submit Verification"}
      </button>
    </form>
  );
}
