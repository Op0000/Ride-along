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
            <li>Technical info like IP address, device type, etc.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">2. How We Use It</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>To provide and improve the ride-sharing experience.</li>
            <li>For user support, communication, and safety purposes.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">3. Data Sharing</h2>
          <p className="mt-2">We <strong className="text-green-400">do not sell or trade</strong> your data.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Shared with drivers or passengers (only when you book or post a ride).</li>
            <li>Used by trusted third-party services like Firebase or analytics tools.</li>
            <li>Shared if required by law.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">4. Your Choices</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>You can edit or delete your profile anytime.</li>
            <li>You can contact us for complete account deletion.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">5. Security</h2>
          <p className="mt-2">
            We use secure encryption, Firebase Authentication, and protected servers to keep your data <span className="text-green-400 font-semibold">safe</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
