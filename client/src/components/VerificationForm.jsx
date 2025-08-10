import React, { useState } from "react";
import axios from "axios";

export default function VerificationForm() {
  const [files, setFiles] = useState({
    idProof: null,
    license: null,
    rcBook: null,
    profilePhoto: null,
  });

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url; // backend should return { url: "https://..." }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Upload files
      const idProofUrl = await uploadFile(files.idProof);
      const licenseUrl = await uploadFile(files.license);
      const rcBookUrl = await uploadFile(files.rcBook);
      const profilePhotoUrl = await uploadFile(files.profilePhoto);

      // 2️⃣ Submit verification
      await axios.post(
        "/api/verify/submit",
        { idProofUrl, licenseUrl, rcBookUrl, profilePhotoUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Firebase ID token
          },
        }
      );

      alert("✅ Documents submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <h2>Driver Verification</h2>

      <input type="file" name="idProof" onChange={handleFileChange} required />
      <input type="file" name="license" onChange={handleFileChange} required />
      <input type="file" name="rcBook" onChange={handleFileChange} required />
      <input
        type="file"
        name="profilePhoto"
        onChange={handleFileChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Submit Verification"}
      </button>
    </form>
  );
}
