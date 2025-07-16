import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function RouteMap({ from, to, via = [] }) {
  const [routeCoords, setRouteCoords] = useState([])

  const coords = {
    delhi: [28.6139, 77.2090],
    jaipur: [26.9124, 75.7873],
    agra: [27.1767, 78.0081],
    mumbai: [19.0760, 72.8777],
    pune: [18.5204, 73.8567]
  }

  const getLatLng = (city) => coords[city.toLowerCase()] || null

  useEffect(() => {
    const routePoints = [from, ...via, to]
    const points = routePoints.map(getLatLng).filter(Boolean)

    if (points.length < 2) return

    const query = points.map(p => `${p[1]},${p[0]}`).join(';') // lng,lat

    fetch(`https://router.project-osrm.org/route/v1/driving/${query}?overview=full&geometries=geojson`)
      .then(res => res.json())
      .then(data => {
        if (data.routes?.[0]?.geometry?.coordinates) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
          setRouteCoords(coords)
        }
      })
      .catch(err => console.error('Routing error:', err))
  }, [from, to, via])

  return (
    <div className="h-64 mt-6 rounded-lg overflow-hidden">
      <MapContainer center={getLatLng(from)} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="purple" weight={5} />
        )}
      </MapContainer>
    </div>
  )
}
