export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          🛍️ AI Retail System
        </h1>
        <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
          Smart inventory management platform for retailers
        </p>
        <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
          Manage your shop with AI-powered product descriptions, flexible inventory fields, and intelligent search
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="/login"
            className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            🔐 Login
          </a>
          <a
            href="/register"
            className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            📝 Register as Seller
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-bold text-lg mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">
              Auto-generate product images and descriptions
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-bold text-lg mb-2">Flexible Fields</h3>
            <p className="text-gray-600 text-sm">
              Customize product fields for your business
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2">Easy to Use</h3>
            <p className="text-gray-600 text-sm">
              Simple interface for non-technical users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

