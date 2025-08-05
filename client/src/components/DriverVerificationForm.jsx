import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase"; // adjust path
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // adjust if you're using your own auth system

const DriverVerificationForm = () => {
  const { currentUser, token } = useAuth();
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const uploadFile = async (file, folder) => {
    const fileRef = ref(storage, `driverDocs/${currentUser.uid}/${folder}`);
    const snap = await uploadBytes(fileRef, file);
    return await getDownloadURL(snap.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setSuccess("");

    try {
      const idProofUrl = await uploadFile(files.idProof, "idProof");
      const licenseUrl = await uploadFile(files.license, "license");
      const rcBookUrl = await uploadFile(files.rcBook, "rcBook");
      const profilePhotoUrl = await uploadFile(files.profilePhoto, "profilePhoto");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/verify/submit`,
        { idProofUrl, licenseUrl, rcBookUrl, profilePhotoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Documents submitted! Waiting for approval.");
    } catch (err) {
      console.error("Verification error:", err);
      setSuccess("Submission failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Driver Verification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" name="idProof" onChange={handleChange} required />
        <input type="file" name="license" onChange={handleChange} required />
        <input type="file" name="rcBook" onChange={handleChange} required />
        <input type="file" name="profilePhoto" onChange={handleChange} required />

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {uploading ? "Uploading..." : "Submit for Verification"}
        </button>

        {success && <p className="text-center mt-3 text-green-600">{success}</p>}
      </form>
    </div>
  );
};

export default DriverVerificationForm;
