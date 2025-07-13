//App loading
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import PostRide from './pages/PostRide.jsx'
import SearchRides from './pages/SearchRide.jsx'

function App() {
  return (
    <div>
      <nav className="p-4 bg-blue-600 text-white flex justify-between">
        <Link to="/" className="font-bold text-xl">Ride Along</Link>
        <div className="space-x-4">
          <Link to="/post">Post Ride</Link>
          <Link to="/search">Search</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<PostRide />} />
        <Route path="/search" element={<SearchRides />} />
        <Route path="/ride/:id" element={<RideDetail />} />
      </Routes>
    </div>
  )
}

export default App
