// utils/geocode.js
export async function getLatLng(city) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`)
    const data = await res.json()

    if (data.length === 0) return null

    return [parseFloat(data[0].lat), parseFloat(data[0].lon)] // [lat, lng]
  } catch (err) {
    console.error('Geocoding error:', err)
    return null
  }
}
