import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function RouteMap({ from, to, via = [] }) {
  const routePoints = [from, ...via, to]

  // Example static coordinates for demonstration (replace with real ones via API later)
  const coords = {
    delhi: [28.6139, 77.2090],
    jaipur: [26.9124, 75.7873],
    agra: [27.1767, 78.0081],
    mumbai: [19.0760, 72.8777],
    pune: [18.5204, 73.8567]
  }

  const getLatLng = (place) => coords[place.toLowerCase()] || [0, 0]
  const path = routePoints.map((city) => getLatLng(city))

  return (
    <div className="h-64 rounded-lg overflow-hidden mt-6">
      <MapContainer
        center={path[0]}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={path} color="purple" weight={4} />
      </MapContainer>
    </div>
  )
}
