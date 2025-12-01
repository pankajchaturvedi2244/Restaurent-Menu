'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Restaurant {
  id: string;
  name: string;
  location: string;
}

// Sample restaurant images and colors for visual variety
const restaurantPresets = [
  {
    image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400',
    gradient: 'from-orange-400 to-red-600',
    icon: '🍔',
  },
  {
    image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
    gradient: 'from-yellow-400 to-orange-500',
    icon: '🍕',
  },
  {
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    gradient: 'from-green-400 to-emerald-600',
    icon: '🥗',
  },
  {
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400',
    gradient: 'from-purple-400 to-pink-600',
    icon: '🍜',
  },
  {
    image: 'https://images.pexels.com/photos/1816583/pexels-photo-1816583.jpeg?auto=compress&cs=tinysrgb&w=400',
    gradient: 'from-blue-400 to-cyan-600',
    icon: '🍱',
  },
  {
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400',
    gradient: 'from-pink-400 to-rose-600',
    icon: '🍰',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants');
      if (!res.ok) throw new Error('Failed to fetch restaurants');
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create restaurant');
      const newRestaurant = await res.json();
      setRestaurants([...restaurants, newRestaurant]);
      setFormData({ name: '', location: '' });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  const handleDeleteRestaurant = async (id: string) => {
    if (!window.confirm('Are you sure? This will delete the restaurant and all its menus.')) return;

    try {
      const res = await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setRestaurants(restaurants.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getPresetForRestaurant = (index: number) => {
    return restaurantPresets[index % restaurantPresets.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Restaurant Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your digital menus</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Restaurant Section */}
        <div className="mb-12">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-xl hover:from-pink-600 hover:to-red-700 transition font-semibold text-lg shadow-lg"
            >
              <span className="text-2xl">+</span>
              Add New Restaurant
            </button>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Create New Restaurant</h2>
              
              <form onSubmit={handleAddRestaurant}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., The Golden Fork"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Downtown, Mumbai"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 transition font-semibold"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Restaurant'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Restaurants List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading restaurants...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-600 text-lg mb-4">No restaurants yet. Create your first restaurant to get started!</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <span>+</span>
              Create First Restaurant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => {
              const preset = getPresetForRestaurant(index);
              return (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition overflow-hidden group"
                >
                  {/* Restaurant Image / Gradient Background */}
                  <div className={`relative h-40 bg-gradient-to-br ${preset.gradient} overflow-hidden`}>
                    <Image
                      src={preset.image}
                      alt={restaurant.name}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-80 transition"
                    />
                    {/* Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl drop-shadow-lg">{preset.icon}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-6 flex items-center gap-2">
                      <span>📍</span>
                      {restaurant.location}
                    </p>

                    {/* Stats Preview */}
                    <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">0</div>
                        <div className="text-xs text-gray-600">Categories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-xs text-gray-600">Dishes</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/restaurants/${restaurant.id}`}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-lg text-center hover:from-pink-600 hover:to-red-700 transition font-semibold text-sm"
                      >
                        📋 Manage Menu
                      </Link>
                      <button
                        onClick={() => handleDeleteRestaurant(restaurant.id)}
                        className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold text-sm"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Share Button */}
                    <Link
                      href={`/dashboard/restaurants/${restaurant.id}/qr`}
                      className="mt-3 block w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg text-center hover:bg-green-200 transition font-semibold text-sm"
                    >
                      📱 Share Menu
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2025 Digital Menu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
