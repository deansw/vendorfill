export default function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-black text-green-600 mb-8">Payment Successful!</h1>
        <p className="text-2xl text-gray-700 mb-4">Your PDF is being filled by AI...</p>
        <p className="text-xl text-gray-600">You'll receive the filled PDF by email in 5-10 minutes.</p>
      </div>
    </div>
  )
}
