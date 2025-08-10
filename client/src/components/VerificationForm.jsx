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
    setFiles((prev) => ({ ...prev, [name]: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percent);
      },
    });
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    try {
      // Upload each file
      const idProofUrl = await uploadFile(files.idProof);
      const licenseUrl = await uploadFile(files.license);
      const rcBookUrl = await uploadFile(files.rcBook);
      const profilePhotoUrl = await uploadFile(files.profilePhoto);

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

      alert("✅ Documents submitted successfully!");
      setFiles({});
      setPreviews({});
    } catch (err) {
      console.error(err);
      alert(`❌ Error: ${err.response?.data?.message || err.message}`);
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
            {fileLabels[key]}
          </label>
          <div className="flex items-center gap-3">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-400/10 transition">
              <CloudArrowUpIcon className="w-8 h-8 text-purple-300" />
              <span className="text-xs text-gray-300">Click or drag file</span>
              <input
                type="file"
                name={key}
                onChange={handleFileChange}
                className="hidden"
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
