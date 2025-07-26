import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function RouteMap({ from, to, via = [] }) {
  const [routeCoords, setRouteCoords] = useState([])
  const [center, setCenter] = useState([26.8467, 80.9462]) // Lucknow (UP center)

  const isLocationInUP = (address) =>
    address.toLowerCase().includes('uttar pradesh') || address.toLowerCase().includes('up')

  const getLatLng = async (place) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&addressdetails=1`
      )
      const data = await res.json()
      if (data.length === 0) return null

      const location = data[0]
      const state = location.address?.state || ''
      const displayName = location.display_name || ''

      // ✅ Restrict to UP only
      if (!state.toLowerCase().includes('uttar pradesh')) return null

      return [parseFloat(location.lat), parseFloat(location.lon)]
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

      if (validCoords.length < 2) {
        setRouteCoords([]) // Clear map if route invalid
        return
      }

      setCenter(validCoords[0]) // Center on "from"

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
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        maxBounds={[
          [23.5, 77.0], // Southwest of UP
          [30.5, 84.5], // Northeast of UP
        ]}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="purple" weight={5} />
        )}
      </MapContainer>
    </div>
  )
}
