import { useEffect, useState } from 'react'

export default function AutocompleteInput({ name, value, onChange, placeholder }) {
  const [query, setQuery] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (query.length < 2) return setSuggestions([])

    const controller = new AbortController()

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&accept-language=en&countrycodes=in&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'User-Agent': 'RideAlong/1.0' }
      }
    )
      .then(res => res.json())
      .then(data => {
        const upSuggestions = data.filter(place =>
          place.address?.state?.toLowerCase() === 'uttar pradesh'
        )
        setSuggestions(upSuggestions)
      })
      .catch(err => console.error('Nominatim error:', err))

    return () => controller.abort()
  }, [query])

  const handleSelect = (place) => {
    const displayName = place.display_name
    setQuery(displayName)
    setSuggestions([])
    onChange(name, displayName)
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          const val = e.target.value
          setQuery(val)
          onChange(name, val)
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
