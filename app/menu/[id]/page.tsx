'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface DishCategory {
  categoryId: string;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  image: string;
  spiceLevel?: number | null;
  categories: DishCategory[];
}

interface Category {
  id: string;
  name: string;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
}

export default function PublicMenuPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const categoryRefsMap = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const fetchMenu = useCallback(async () => {
    try {
      const dishRes = await fetch(`/api/public/menu/${restaurantId}`);
      if (!dishRes.ok) {
        const text = await dishRes.text().catch(() => 'Unable to read response');
        throw new Error(`Menu fetch failed (${dishRes.status}): ${text}`);
      }

      const menuData = await dishRes.json();
      setRestaurant(menuData.restaurant);
      setDishes(menuData.dishes);

      const uniqueCategories = Array.from(
        new Map(
          menuData.categories.map((cat: Category) => [cat.id, cat])
        ).values()
      ) as Category[];
      setCategories(uniqueCategories);

      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setMenuOpen(false);
    const element = categoryRefsMap.current[categoryId];
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const getDishesForCategory = (categoryId: string) => {
    return dishes.filter((dish) =>
      dish.categories.some((cat) => cat.categoryId === categoryId)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading menu...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-600 text-center px-4">{error || 'Restaurant not found'}</p>
      </div>
    );
  }

  const activeCategoryName = categories.find((c) => c.id === activeCategory)?.name || '';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Fixed Header with Restaurant Info */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="text-sm md:text-base text-gray-600">{restaurant.location}</p>
        </div>
      </header>

      {/* Fixed Category Header */}
      {activeCategory && (
        <div className="fixed top-24 left-0 right-0 z-30 bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <h2 className="text-xl md:text-2xl font-bold">{activeCategoryName}</h2>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main ref={menuRef} className="flex-1 mt-40 pb-24 md:pb-20">
        <div className="max-w-4xl mx-auto px-3 md:px-4 py-6">
          {categories.map((category) => {
            const categoryDishes = getDishesForCategory(category.id);
            if (categoryDishes.length === 0) return null;

            return (
              <section
                key={category.id}
                ref={(el) => {
                  if (el) categoryRefsMap.current[category.id] = el;
                }}
                className="mb-8"
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-300">
                  {category.name}
                </h3>

                <div className="space-y-4">
                  {categoryDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex gap-4"
                    >
                      {/* Dish Image */}
                      <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28">
                        <div className="relative w-24 h-24 md:w-28 md:h-28">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Dish Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-base md:text-lg font-bold text-gray-900">
                              {dish.name}
                            </h4>
                            {dish.spiceLevel && dish.spiceLevel > 0 && (
                              <span className="text-sm flex-shrink-0">
                                {'🌶️'.repeat(Math.min(dish.spiceLevel, 5))}
                              </span>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                            {dish.description}
                          </p>
                        </div>

                        {/* Category Tags */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {dish.categories.map((cat) => (
                            <span
                              key={cat.categoryId}
                              className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs font-medium"
                            >
                              {categories.find((c) => c.id === cat.categoryId)?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Floating Menu Button */}
      {categories.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-lg hover:shadow-xl transition"
          >
            ☰
          </button>

          {/* Category Menu Dropdown */}
          {menuOpen && (
            <div className="absolute bottom-20 right-0 w-56 bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition ${
                      activeCategory === category.id
                        ? 'bg-pink-100 text-pink-700 border-l-4 border-pink-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Desktop Category Sidebar (visible on larger screens) */}
      {categories.length > 0 && (
        <div className="hidden md:fixed md:left-0 md:top-28 md:w-48 md:h-full md:bg-white md:shadow md:overflow-y-auto md:z-20">
          <div className="p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm font-medium transition ${
                    activeCategory === category.id
                      ? 'bg-pink-100 text-pink-700 border-l-4 border-pink-500 pl-2'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Adjust main content on desktop if sidebar is shown */}
      {categories.length > 0 && <div className="hidden md:block w-48" />}
    </div>
  );
}
