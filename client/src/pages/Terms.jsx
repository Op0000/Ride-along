export default function TermsAndConditions() {
  return (
    <div className="p-6 text-white bg-zinc-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Terms & Conditions</h1>
      <div className="text-zinc-300 leading-relaxed space-y-6">
        
        <div>
          <h2 className="font-semibold text-lg text-purple-300">1. Eligibility</h2>
          <p className="mt-2">
            You must be at least <strong className="text-green-400">16 years old</strong> to use Ride Along. 
            You are solely responsible for keeping your login credentials safe.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">2. Posting & Booking Rides</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>All ride details must be accurate and up-to-date.</li>
            <li>Passengers must respect the driver’s instructions.</li>
            <li>Fake rides, spamming, or abuse may lead to a permanent ban.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">3. Content Ownership</h2>
          <p className="mt-2">
            You retain ownership of your data. By submitting ride or profile info,
            you grant Ride Along permission to use it solely for delivering platform services.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">4. Limitations</h2>
          <p className="mt-2">
            Ride Along is only a platform. We do <span className="text-red-400 font-semibold">not control</span> drivers,
            passengers, or vehicles. Use the service at your own discretion and risk.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">5. Modifications</h2>
          <p className="mt-2">
            We may update these terms from time to time. Continued use after changes
            means you agree to the updated terms.
          </p>
        </div>

      </div>
    </div>
  )
}
