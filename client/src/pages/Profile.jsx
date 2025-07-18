import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'

export default function Profile() {
const auth = getAuth()
const user = auth.currentUser
const [details, setDetails] = useState({
uid: '',
name: '',
age: '',
gender: '',
phone: '',
email: ''
})
const [loading, setLoading] = useState(true)
const [saved, setSaved] = useState(false)
const [errors, setErrors] = useState({})

const API_BASE = 'https://ride-along-api.onrender.com/api/users'

useEffect(() => {
if (!user) return

const fetchUser = async () => {  
  try {  
    const res = await fetch(`${API_BASE}/${user.uid}`)  
    if (res.ok) {  
      const data = await res.json()  
      setDetails({ ...data, uid: user.uid })  
    } else {  
      setDetails(prev => ({  
        ...prev,  
        uid: user.uid,  
        email: user.email || '',  
        name: user.displayName || ''  
      }))  
    }  
  } catch (err) {  
    console.error('Fetch failed:', err)  
  } finally {  
    setLoading(false)  
  }  
}  

fetchUser()

}, [user])

const validate = () => {
const errs = {}
if (!details.name) errs.name = 'Name is required'
if (!details.age || details.age < 1) errs.age = 'Enter a valid age'
if (!details.gender) errs.gender = 'Select your gender'
if (!/^\d{10}$/.test(details.phone)) errs.phone = 'Enter a 10-digit phone number'
if (!/^\S+@\S+.\S+$/.test(details.email)) errs.email = 'Invalid email format'
setErrors(errs)
return Object.keys(errs).length === 0
}

const handleChange = (e) => {
const { name, value } = e.target
setDetails((prev) => ({ ...prev, [name]: value }))
setErrors((prev) => ({ ...prev, [name]: '' }))
}

const handleSave = async () => {
if (!validate()) return

try {  
  const res = await fetch(`${API_BASE}/save`, {  
    method: 'POST',  
    headers: { 'Content-Type': 'application/json' },  
    body: JSON.stringify(details)  
  })  

  if (res.ok) {  
    setSaved(true)  
    setTimeout(() => setSaved(false), 2000)  
  }  
} catch (err) {  
  console.error('Save failed:', err)  
}

}

if (loading) return <div className="text-center mt-10 text-white">Loading...</div>

return (
<div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-4 sm:p-6">
<h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Your Profile</h1>

<div className="bg-zinc-800 p-4 sm:p-6 rounded-2xl max-w-md mx-auto space-y-4 shadow-2xl border border-zinc-700">  
    {/* UID - non-editable */}  
    <div>  
      <label className="block text-sm mb-1 text-purple-300">UID</label>  
      <input  
        name="uid"  
        type="text"  
        value={details.uid}  
        readOnly  
        className="w-full px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 opacity-80 cursor-not-allowed"  
      />  
    </div>  

    {/* Editable fields */}  
    {['name', 'age', 'phone', 'email'].map((field) => (  
      <div key={field}>  
        <label className="block text-sm mb-1 capitalize text-purple-300">{field}</label>  
        <input  
          name={field}  
          type={field === 'age' ? 'number' : 'text'}  
          value={details[field] || ''}  
          onChange={handleChange}  
          className={`w-full px-3 py-2 rounded-lg bg-zinc-700 text-white border focus:outline-none focus:ring-2 focus:ring-purple-500 ${  
            errors[field] ? 'border-red-500' : 'border-zinc-600'  
          }`}  
        />  
        {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}  
      </div>  
    ))}  

    {/* Gender dropdown */}  
    <div>  
      <label className="block text-sm mb-1 text-purple-300">Gender</label>  
      <select  
        name="gender"  
        value={details.gender}  
        onChange={handleChange}  
        className={`w-full px-3 py-2 rounded-lg bg-zinc-700 text-white border appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${  
          errors.gender ? 'border-red-500' : 'border-zinc-600'  
        }`}  
      >  
        <option value="">Select</option>  
        <option value="Male">Male</option>  
        <option value="Female">Female</option>  
        <option value="Other">Other</option>  
      </select>  
      {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}  
    </div>  

    {/* Save button */}  
    <button  
      onClick={handleSave}  
      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-200 ease-in-out"  
    >  
      Save Changes  
    </button>  

    {/* Save confirmation */}  
    {saved && (  
      <p className="text-green-400 text-center animate-pulse mt-2">  
        ✅ Profile updated successfully  
      </p>  
    )}  
  </div>  
</div>

)
}
