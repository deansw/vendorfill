"use client"
export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-8 text-center">
          Your Company Profile
        </h1>
        <div className="bg-white rounded-3xl shadow-2xl p-12 space-y-8">
          <input placeholder="Company Name" className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none" />
          <input placeholder="Tax ID / EIN" type="password" className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500" />
          <input placeholder="Bank Account" type="password" className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500" />
          <input placeholder="Bank Routing" className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500" />
          <input placeholder="Accounting Email" type="email" className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500" />
          <button className="w-full bg-blue-600 text-white py-6 rounded-xl text-2xl font-bold hover:bg-blue-700 shadow-lg">
            Save Profile →
          </button>
        </div>
      </div>
    </div>
  )
}
