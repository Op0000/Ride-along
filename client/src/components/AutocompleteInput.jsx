import { useEffect, useState } from 'react'

export default function AutocompleteInput({ value, onChange, placeholder }) {
  const [query, setQuery] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (query.length < 2) return setSuggestions([])

    const controller = new AbortController()

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&accept-language=en`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'RideAlong/1.0' }
    })
      .then(res => res.json())
      .then(data => setSuggestions(data))
      .catch(err => console.log(err))

    return () => controller.abort()
  }, [query])

  const handleSelect = (place) => {
    const displayName = place.display_name
    setQuery(displayName)         // ✅ update input
    setSuggestions([])            // ✅ close dropdown
    onChange(displayName)         // ✅ pass selected back
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        className="input"
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 bg-white text-black shadow-md rounded w-full max-h-48 overflow-y-auto">
          {suggestions.map((sug, i) => (
            <div
              key={i}
              onClick={() => handleSelect(sug)}
              className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
            >
              {sug.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
