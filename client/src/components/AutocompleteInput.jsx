import { useState, useEffect } from 'react'

export default function AutocompleteInput({ label, value, onChange, placeholder }) {
  const [query, setQuery] = useState(value || '')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query) return
    const delayDebounce = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&accept-language=en`)
        .then(res => res.json())
        .then(data => setResults(data.slice(0, 5)))
        .catch(() => setResults([]))
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleSelect = (place) => {
    setQuery(place.display_name)
    onChange(place)
    setSuggestions([])
  }

  return (
    <div className="relative">
      <label className="block text-sm text-white mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded bg-zinc-700 text-white"
      />
      {results.length > 0 && (
        <ul className="absolute z-50 bg-white text-black w-full rounded shadow mt-1 max-h-40 overflow-y-auto">
          {results.map((place, i) => (
            <li
              key={i}
              className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-sm"
              onClick={() => handleSelect(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
              }
