export default function PrivacyPolicy() {
  return (
    <div className="p-6 text-white bg-zinc-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Privacy Policy</h1>
      <div className="text-zinc-300 leading-relaxed space-y-6">
        
        <div>
          <h2 className="font-semibold text-lg text-purple-300">1. Information We Collect</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Name, email, phone, age, gender, and other profile details.</li>
            <li>Location and ride data you submit or browse.</li>
            <li><strong className="text-yellow-400">Real-time location data</strong> when you use our SOS emergency features and live location sharing.</li>
            <li>Place names and addresses derived from your location coordinates.</li>
            <li>Technical info like IP address, device type, etc.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">2. How We Use It</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>To provide and improve the ride-sharing experience.</li>
            <li>For user support, communication, and safety purposes.</li>
            <li><strong className="text-red-400">Emergency location tracking</strong> to help emergency responders locate you when you activate SOS features.</li>
            <li>To generate shareable location links for emergency contacts when you choose to share your live location.</li>
            <li>To display readable place names alongside coordinates for better location identification.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">3. Data Sharing</h2>
          <p className="mt-2">We <strong className="text-green-400">do not sell or trade</strong> your data.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Shared with drivers or passengers (only when you book or post a ride).</li>
            <li><strong className="text-orange-400">Emergency location data</strong> may be shared with emergency services and your designated emergency contacts when you activate SOS features.</li>
            <li>Live location data is shared only through links you generate and choose to share with trusted contacts.</li>
            <li>Used by trusted third-party services like Firebase, OpenStreetMap (for place names), or analytics tools.</li>
            <li>Shared if required by law.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">4. Your Choices</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>You can edit or delete your profile anytime.</li>
            <li><strong className="text-cyan-400">Location tracking</strong> is only active when you explicitly start live location sharing and can be stopped at any time.</li>
            <li>You control who receives your shareable location links - we never share them without your consent.</li>
            <li>SOS features only activate when you deliberately use them for emergencies.</li>
            <li>You can contact us for complete account deletion.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">5. SOS & Emergency Features</h2>
          <div className="mt-2 space-y-2">
            <p>Our SOS features are designed for emergency situations and involve special data handling:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-red-400">Real-time location tracking:</strong> When activated, your location updates every 30 seconds.</li>
              <li><strong className="text-yellow-400">Shareable links:</strong> Generate unique URLs to share your live location with trusted contacts.</li>
              <li><strong className="text-blue-400">Place name resolution:</strong> We use OpenStreetMap to convert coordinates to readable addresses.</li>
              <li><strong className="text-green-400">Emergency contact integration:</strong> Works with your phone's native emergency features.</li>
              <li><strong className="text-purple-400">Data retention:</strong> Location tracking stops when you deactivate it or close the session.</li>
            </ul>
            <p className="text-orange-300 text-sm mt-2">
              <strong>Important:</strong> SOS features are for genuine emergencies. Misuse may result in account suspension.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">6. Security</h2>
          <p className="mt-2">
            We use secure encryption, Firebase Authentication, and protected servers to keep your data <span className="text-green-400 font-semibold">safe</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
