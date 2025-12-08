"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface DishCategory {
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  image: string;
  spiceLevel?: number | null;
  categories: DishCategory[];
}

export default function MenuManagementPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"categories" | "dishes">(
    "categories"
  );
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showDishForm, setShowDishForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [dishForm, setDishForm] = useState({
    name: "",
    description: "",
    image: "",
    spiceLevel: "",
    categories: [] as string[],
    type: "veg",
    sellingPrice: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [catRes, dishRes] = await Promise.all([
        fetch(`/api/categories?restaurantId=${restaurantId}`),
        fetch(`/api/dishes?restaurantId=${restaurantId}`),
      ]);

      if (!catRes.ok || !dishRes.ok) throw new Error("Failed to fetch data");

      const catData = await catRes.json();
      const dishData = await dishRes.json();

      setCategories(catData);
      setDishes(dishData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName, restaurantId }),
      });

      if (!res.ok) throw new Error("Failed to create category");
      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
      setCategoryName("");
      setShowCategoryForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dishForm,
          spiceLevel: dishForm.spiceLevel
            ? parseInt(dishForm.spiceLevel)
            : null,
          sellingRate: dishForm.sellingPrice,
          restaurantId,
          categories: dishForm.categories,
        }),
      });

      if (!res.ok) throw new Error("Failed to create dish");
      const newDish = await res.json();
      setDishes([...dishes, newDish]);
      setDishForm({
        name: "",
        description: "",
        image: "",
        spiceLevel: "",
        categories: [],
        type: "veg",
        sellingPrice: 0,
      });
      setShowDishForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!window.confirm("Delete this dish?")) return;

    try {
      const res = await fetch(`/api/dishes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setDishes(dishes.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const toggleDishCategory = (categoryId: string) => {
    setDishForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:underline font-semibold text-sm flex items-center gap-1"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Menu Management
              </h1>
            </div>
            <div className="flex gap-2 md:gap-3">
              <Link
                href={`/dashboard/restaurants/${restaurantId}/qr`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition text-sm md:text-base"
              >
                📱 Share Menu
              </Link>
              <a
                href={`/menu/${restaurantId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition text-sm md:text-base"
              >
                👁️ Preview
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === "categories"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              🍽️ Categories
            </button>
            <button
              onClick={() => setActiveTab("dishes")}
              className={`px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === "dishes"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              🍽️ Dishes
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        ) : (
          <>
            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div>
                {!showCategoryForm ? (
                  <button
                    onClick={() => setShowCategoryForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-lg hover:from-pink-600 hover:to-red-700 transition font-semibold shadow-md mb-8"
                  >
                    <span>+</span>
                    Add Category
                  </button>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Create New Category
                    </h2>
                    <form onSubmit={handleAddCategory}>
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          🍽️ Category Name
                        </label>
                        <input
                          type="text"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          placeholder="e.g., Appetizers, Main Course, Desserts"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition"
                          required
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
                        >
                          {isSubmitting ? "Creating..." : "Create Category"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCategoryForm(false)}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {categories.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="text-5xl mb-4">🍽️</div>
                    <p className="text-gray-600 mb-4">
                      No categories yet. Create one to get started!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                      <div key={category.id}>
                        <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-pink-600">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            🍽️ {category.name}
                          </h3>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold"
                          >
                            🗑️ Delete
                          </button>
                        </div>{" "}
                        /
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Dishes Tab */}
            {activeTab === "dishes" && (
              <div>
                {!showDishForm ? (
                  <button
                    onClick={() => setShowDishForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-lg hover:from-pink-600 hover:to-red-700 transition font-semibold shadow-md mb-8"
                  >
                    <span>+</span>
                    Add Dish
                  </button>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Create New Dish
                    </h2>

                    <form onSubmit={handleAddDish}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            🍽️ Dish Name
                          </label>
                          <input
                            type="text"
                            value={dishForm.name}
                            onChange={(e) =>
                              setDishForm({ ...dishForm, name: e.target.value })
                            }
                            placeholder="e.g., Grilled Salmon"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            🖼️ Image URL
                          </label>
                          <input
                            type="url"
                            value={dishForm.image}
                            onChange={(e) =>
                              setDishForm({
                                ...dishForm,
                                image: e.target.value,
                              })
                            }
                            placeholder="https://images.pexels.com/..."
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          📝 Description
                        </label>
                        <textarea
                          value={dishForm.description}
                          onChange={(e) =>
                            setDishForm({
                              ...dishForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the dish, ingredients, preparation..."
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition"
                          rows={4}
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          🥗 Dish Type
                        </label>

                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="dishType"
                              value="veg"
                              checked={dishForm.type === "veg"}
                              onChange={() =>
                                setDishForm({ ...dishForm, type: "veg" })
                              }
                              className="w-5 h-5 text-green-600"
                            />
                            <span className="font-medium text-gray-700">
                              Veg 🟢
                            </span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="dishType"
                              value="non-veg"
                              checked={dishForm.type === "non-veg"}
                              onChange={() =>
                                setDishForm({ ...dishForm, type: "non-veg" })
                              }
                              className="w-5 h-5 text-red-600"
                            />
                            <span className="font-medium text-gray-700">
                              Non-Veg 🔴
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          🌶️ Spice Level (0-5, optional)
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="0"
                            max="5"
                            value={dishForm.spiceLevel}
                            onChange={(e) =>
                              setDishForm({
                                ...dishForm,
                                spiceLevel: e.target.value,
                              })
                            }
                            className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-pink-600"
                          />
                          <span className="text-2xl">
                            {dishForm.spiceLevel && dishForm.spiceLevel !== ""
                              ? "🌶️".repeat(parseInt(dishForm.spiceLevel))
                              : ""}
                          </span>
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Selling Price
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            min="0"
                            value={dishForm.sellingPrice}
                            onChange={(e) =>
                              setDishForm({
                                ...dishForm,
                                sellingPrice: parseFloat(e.target.value),
                              })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          📂 Categories
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto bg-pink-50 p-4 rounded-lg border-2 border-pink-300">
                          {categories.length === 0 ? (
                            <p className="text-gray-600 text-sm">
                              Create categories first
                            </p>
                          ) : (
                            categories.map((category) => (
                              <label
                                key={category.id}
                                className="flex items-center hover:bg-white p-2 rounded transition"
                              >
                                <input
                                  type="checkbox"
                                  checked={dishForm.categories.includes(
                                    category.id
                                  )}
                                  onChange={() =>
                                    toggleDishCategory(category.id)
                                  }
                                  className="w-5 h-5 text-pink-600 rounded cursor-pointer"
                                />
                                <span className="ml-3 text-gray-700 font-medium cursor-pointer">
                                  {category.name}
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={
                            isSubmitting || dishForm.categories.length === 0
                          }
                          className="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                        >
                          {isSubmitting ? "Creating..." : "Create Dish"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDishForm(false)}
                          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {dishes.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="text-5xl mb-4">🍽️</div>
                    <p className="text-gray-600 mb-4">
                      No dishes yet. Create one to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex gap-4"
                      >
                        <div className="flex-shrink-0 w-24 h-24">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            width={96}
                            height={96}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {dish.name}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {dish.description}
                              </p>
                            </div>
                            {dish.spiceLevel && dish.spiceLevel > 0 && (
                              <span className="text-lg flex-shrink-0">
                                {"🌶️".repeat(Math.min(dish.spiceLevel, 5))}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {dish.categories.map((cat) => (
                              <span
                                key={cat.categoryId}
                                className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold"
                              >
                                {
                                  categories.find(
                                    (c) => c.id === cat.categoryId
                                  )?.name
                                }
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteDish(dish.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition h-fit font-semibold"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
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
