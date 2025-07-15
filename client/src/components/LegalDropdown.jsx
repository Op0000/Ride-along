import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

export default function LegalDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block text-left z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 bg-zinc-800 text-white px-3 py-2 rounded-lg hover:bg-zinc-700 transition"
      >
        Legal <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg text-white">
          <Link to="/privacy" className="block px-4 py-2 hover:bg-zinc-800">Privacy Policy</Link>
          <Link to="/terms" className="block px-4 py-2 hover:bg-zinc-800">Terms & Conditions</Link>
          <Link to="/contact" className="block px-4 py-2 hover:bg-zinc-800">Contact</Link>
        </div>
      )}
    </div>
  )
}
