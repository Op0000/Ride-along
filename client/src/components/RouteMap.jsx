import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function RouteMap({ from, to, via = [] }) {
  const [routeCoords, setRouteCoords] = useState([])
  const [center, setCenter] = useState([20.5937, 78.9629]) // Default center (India)

  const getLatLng = async (place) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      )
      const data = await res.json()
      if (data.length === 0) return null
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)] // [lat, lng]
    } catch (err) {
      console.error('Geocoding error:', err)
      return null
    }
  }

  useEffect(() => {
    const fetchRoute = async () => {
      const routePoints = [from, ...via, to]
      const coords = await Promise.all(routePoints.map(getLatLng))
      const validCoords = coords.filter(Boolean)

      if (validCoords.length < 2) return

      setCenter(validCoords[0]) // Use "from" location as center

      const query = validCoords.map(p => `${p[1]},${p[0]}`).join(';') // lng,lat
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${query}?overview=full&geometries=geojson`)
      const data = await res.json()

      if (data.routes?.[0]?.geometry?.coordinates) {
        const route = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
        setRouteCoords(route)
      }
    }

    fetchRoute()
  }, [from, to, via])

  return (
    <div className="h-64 mt-6 rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="purple" weight={5} />
        )}
      </MapContainer>
    </div>
  )
}
