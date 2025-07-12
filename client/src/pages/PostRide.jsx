import { useState } from "react"

export default function PostRide() {
  const [form, setForm] = useState({
    driverName: "",
    from: "",
    to: "",
    via: "",
    price: "",
    seatsAvailable: "",
    departureTime: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("https://ride-along-api.onrender.com/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          via: form.via.split(",").map(s => s.trim())
        })
      })
      const data = await res.json()
      alert(data.message || "Ride posted!")
      setForm({
        driverName: "",
        from: "",
        to: "",
        via: "",
        price: "",
        seatsAvailable: "",
        departureTime: ""
      })
    } catch (err) {
      console.error(err)
      alert("Failed to post ride")
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Offer a Ride</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["driverName", "from", "to", "via", "price", "seatsAvailable", "departureTime"].map((field, i) => (
          <input
            key={i}
            type={field === "departureTime" ? "datetime-local" : "text"}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={
              field === "via" ? "Via (comma separated)" :
              field === "seatsAvailable" ? "Seats Available" :
              field.charAt(0).toUpperCase() + field.slice(1)
            }
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        ))}
        <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
          Post Ride
        </button>
      </form>
    </div>
  )
            }
