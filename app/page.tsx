// app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">VendorFill</h1>
          <p className="text-xl text-gray-600">Submit your info once. Never fill another vendor form.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-indigo-600">$39</div>
            <div className="text-gray-500">per month</div>
          </div>

          <form action="/api/checkout" method="POST">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold text-lg py-5 rounded-xl hover:bg-indigo-700 transition shadow-lg"
            >
              Start 7-Day Free Trial
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>✓ Unlimited vendor forms</p>
            <p>✓ Secure encrypted storage</p>
            <p>✓ Cancel anytime</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Powered by Next.js • Stripe • Orgo.ai • Claude
        </p>
      </div>
    </div>
  );
}
