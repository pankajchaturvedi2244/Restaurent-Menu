"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import vegIcon from "@/public/Veg_symbol.svg";
import nonVegIcon from "@/public/Non_veg_symbol.svg";

interface DishCategory {
  categoryId: string;
}

interface Dish {
  quantity: number;
  id: string;
  name: string;
  description: string;
  image: string;
  spiceLevel?: number | null;
  categories: DishCategory[];
  type: "veg" | "non-veg" | "vegan";
  sellingRate: number;
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
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const categoryRefsMap = useRef<{ [key: string]: HTMLElement | null }>({});

  const fetchMenu = useCallback(async () => {
    try {
      const dishRes = await fetch(`/api/public/menu/${restaurantId}`);
      if (!dishRes.ok) {
        const text = await dishRes
          .text()
          .catch(() => "Unable to read response");
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
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    const handleScroll = () => {
      let current = "";

      for (const cat of categories) {
        const el = categoryRefsMap.current[cat.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            current = cat.id;
          }
        }
      }

      if (current && current !== activeCategory) {
        setActiveCategory(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setMenuOpen(false);
    const element = categoryRefsMap.current[categoryId];
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <p className="text-lg text-red-600 text-center px-4">
          {error || "Restaurant not found"}
        </p>
      </div>
    );
  }

  const activeCategoryName =
    categories.find((c) => c.id === activeCategory)?.name || "";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ---------- HEADER ---------- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {restaurant.name}
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {restaurant.location}
          </p>
        </div>
      </header>

      {activeCategory && (
        <div className="fixed top-21 left-0 right-0 z-40 bg-gradient-to-r from-pink-500 to-red-500 text-white shadow">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <h2 className="text-xl md:text-2xl font-bold text-center tracking-wide">
              {categories.find((c) => c.id === activeCategory)?.name}
            </h2>
          </div>
        </div>
      )}

      {/* ---------- MAIN CONTENT ---------- */}
      <main ref={menuRef} className="flex-1 mt-30  md:pb-20">
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
                className="mb-10"
              >
                {/* Category Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-300">
                  {category.name}
                </h3>

                {/* Dish List */}
                <div className="space-y-4">
                  {categoryDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-white rounded-xl shadow p-4 flex justify-between items-start gap-4"
                    >
                      {/* LEFT: Info */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          {dish.type === "veg" && (
                            <Image
                              src={vegIcon}
                              alt="veg"
                              width={18}
                              height={18}
                            />
                          )}
                          {dish.type === "non-veg" && (
                            <Image
                              src={nonVegIcon}
                              alt="non-veg"
                              width={18}
                              height={18}
                            />
                          )}
                          <h4 className="text-base font-bold text-gray-900">
                            {dish.name}
                          </h4>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                          ₹{dish.sellingRate}
                        </p>

                        <p className="text-xs text-gray-600 line-clamp-2">
                          {dish.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {dish.categories.map((cat) => (
                            <span
                              key={cat.categoryId}
                              className="px-2 py-1 bg-pink-100 text-pink-700 rounded-lg text-xs"
                            >
                              {
                                categories.find((c) => c.id === cat.categoryId)
                                  ?.name
                              }
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* RIGHT: Image */}
                      <div className="w-24 h-24 relative flex-shrink-0">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* ---------- FLOATING MENU BUTTON ---------- */}
      {categories.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-xl flex items-center justify-center text-2xl"
          >
            ☰
          </button>
        </div>
      )}

      {/* FULLSCREEN POPUP MENU */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute right-4 top-4 text-gray-500 text-lg"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-5">Menu</h2>

            {/* CATEGORY + DISHES STRUCTURE */}
            <div className="space-y-8">
              {categories.map((category) => {
                const dishesInCategory = dishes.filter((d) =>
                  d.categories.some((c) => c.categoryId === category.id)
                );

                return (
                  <div key={category.id}>
                    {/* CATEGORY HEADING — centered + pink */}
                    <h3 className="text-base font-semibold text-pink-600 text-center mb-3">
                      {category.name}
                    </h3>

                    {/* DISH LIST UNDER CATEGORY */}
                    <div className="space-y-2 px-2">
                      {dishesInCategory.map((dish) => (
                        <button
                          key={dish.id}
                          //onClick={() => handleDishClick(dish.id)}
                          className="w-full flex items-center justify-between px-3 py-2  hover:bg-gray-200 rounded-lg transition"
                        >
                          <span className="text-sm font-medium text-gray-800">
                            {dish.name}
                          </span>

                          {/* Dish Count */}
                          <span className="text-xs  text-gray-800 px-2 py-1 rounded-full">
                            {dish.quantity ?? 1}
                          </span>
                        </button>
                      ))}

                      {dishesInCategory.length === 0 && (
                        <p className="text-xs text-gray-500 italic text-center">
                          No dishes
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------- DESKTOP CATEGORY SIDEBAR ---------- */}
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
                      ? "bg-pink-100 text-pink-700 border-l-4 border-pink-500 pl-2"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* layout fix */}
      {categories.length > 0 && <div className="hidden md:block w-48" />}
    </div>
  );
}
