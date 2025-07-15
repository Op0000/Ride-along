export default function RefundAndContact() {
  return (
    <div className="p-6 text-white bg-zinc-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Refund & Contact</h1>
      <div className="text-zinc-300 leading-relaxed space-y-6">
        
        <div>
          <h2 className="font-semibold text-lg text-purple-300">Refund Policy</h2>
          <p className="mt-2">
            Ride Along is a <strong className="text-yellow-400">free-to-use platform</strong> for ride coordination.
            We do not handle payments directly, so <span className="text-red-400 font-semibold">no refunds</span> are processed by us.
            If you've made a payment outside the platform, please contact the respective driver or passenger directly.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-purple-300">Contact Us</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>For account issues, bug reports, or questions, email: <span className="text-blue-400">help.trenddash@gmail.com</span></li>
            <li>For account deletion requests, mention your registered email and UID.</li>
            <li>We typically respond within <strong>48 hours</strong>.</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
