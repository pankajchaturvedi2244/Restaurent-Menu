import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">Digital Menu</div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Digital Menu Management for Restaurants
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create, manage, and share your restaurant menus digitally. Let customers view your menu with QR codes or direct links. No app required.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg"
          >
            Start Free Trial
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 font-bold text-lg"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Manage Menus</h3>
            <p className="text-gray-600">
              Create and organize your menu with categories and dishes. Include descriptions, images, and spice levels.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">QR Codes</h3>
            <p className="text-gray-600">
              Generate QR codes for each restaurant. Customers can scan to view your menu instantly on their phones.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Share Links</h3>
            <p className="text-gray-600">
              Share direct links to your menu via email, SMS, or social media. No app download needed.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Modern UI</h3>
            <p className="text-gray-600">
              Beautiful, responsive design that works on all devices. Professional look for your restaurant.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Fast & Easy</h3>
            <p className="text-gray-600">
              Quick setup. Easy management. Update your menu anytime without technical skills.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Multiple Restaurants</h3>
            <p className="text-gray-600">
              Manage multiple restaurants from a single dashboard. Perfect for restaurant groups.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to go digital?</h2>
          <p className="text-xl mb-8">
            Join hundreds of restaurants already using Digital Menu to serve their customers better.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-bold text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Digital Menu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
