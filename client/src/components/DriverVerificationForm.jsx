import React, { useState } from "react";

const DriverVerificationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    vehicleNumber: "",
    documents: [],
  });

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("licenseNumber", formData.licenseNumber);
      data.append("vehicleNumber", formData.vehicleNumber);

      for (let i = 0; i < formData.documents.length; i++) {
        data.append("documents", formData.documents[i]);
      }

      const res = await fetch("/api/verify/submit", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("✅ Documents uploaded successfully!");
      } else {
        setMessage(`❌ Error: ${result.error || "Upload failed"}`);
      }
    } catch (error) {
      setMessage("❌ Network error, please try again.");
    }

    setUploading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Driver Verification
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="text"
          name="licenseNumber"
          placeholder="License Number"
          value={formData.licenseNumber}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={formData.vehicleNumber}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full border rounded p-2"
          accept="image/*,application/pdf"
          required
        />

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Submit Verification"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-semibold">{message}</p>
      )}
    </div>
  );
};

export default DriverVerificationForm;
