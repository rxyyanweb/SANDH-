import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, Bike, Utensils, Plus, ArrowRight } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, DELIVERY_AREAS } from '../data/restaurantData';
import { MenuItem } from '../types/restaurant';
import { useRestaurant } from '../context/RestaurantContext';

export const MenuSection: React.FC = () => {
  const { setCustomizingItem, toggleFavorite, isFavorite, selectedAreaId, addToCart, setIsCheckoutOpen } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [animCycle, setAnimCycle] = useState(1);
  const [headerSpotlight, setHeaderSpotlight] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasRevealedOnce = useRef(false);

  useEffect(() => {
    const triggerMenuAnimation = () => {
      setAnimCycle((prev) => prev + 1);
      setHeaderSpotlight(true);
      setTimeout(() => setHeaderSpotlight(false), 900);
    };

    const handleSectionNav = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail === 'menu') {
        triggerMenuAnimation();
      }
    };

    window.addEventListener('section-navigate', handleSectionNav);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRevealedOnce.current) {
            hasRevealedOnce.current = true;
            triggerMenuAnimation();
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener('section-navigate', handleSectionNav);
      observer.disconnect();
    };
  }, []);

  const selectedArea = DELIVERY_AREAS.find((a) => a.id === selectedAreaId) || DELIVERY_AREAS[0];

  // Filter items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.categoryId.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCategory;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const handleAddToCartClick = (item: MenuItem) => {
    setCustomizingItem(item);
  };

  const handleOrderNowClick = (item: MenuItem) => {
    setCustomizingItem(item);
  };

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="py-10 sm:py-16 bg-white/90 dark:bg-[#0d0f13]/85 backdrop-blur-[2px] border-t border-gray-200 dark:border-[#1e222c] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#212633] rounded-2xl transition-all ${
            headerSpotlight ? 'animate-menu-spotlight' : ''
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-[#d4af37] tracking-wider uppercase">
              <Utensils className="w-3.5 h-3.5" />
              <span>Digital Menu</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-[#fbf7ee] mt-1">
              Sandh Specialties
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-[#929cb0] mt-1">
              Iron-wok Karahi, Handi in clay pots, charcoal BBQ & fresh tandoor.
            </p>
          </div>

          {/* Delivery Fee & Search row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Delivery fee info */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50/90 dark:bg-[#151821]/90 border border-gray-200 dark:border-[#272d3c] rounded-xl text-xs text-gray-700 dark:text-[#a0aab8]">
              <Bike className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4af37]" />
              <span>
                Delivery to {selectedArea.name}: <strong className="text-gray-900 dark:text-[#fbf7ee]">Rs. {selectedArea.fee}</strong>
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#6e788c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food (Karahi, BBQ, Naan)..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#151821] border border-gray-300 dark:border-[#262c3b] rounded-xl text-xs sm:text-sm text-gray-900 dark:text-[#f4efe6] placeholder-gray-400 dark:placeholder-[#5c6576] focus:outline-none focus:border-amber-500 dark:focus:border-[#d4af37] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-[#f4efe6] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Category Filter Tabs */}
        <div className="sticky top-[56px] sm:top-[70px] z-20 bg-white/95 dark:bg-[#0d0f13]/95 backdrop-blur-md py-2.5 -mx-3 px-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-y border-gray-200 dark:border-[#1e2330] shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none transition-colors">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const categoryIcons: Record<string, string> = {
              all: '🍽️',
              karahi: '🍲',
              bbq: '🍢',
              handi: '🏺',
              rice: '🍚',
              tandoor: '🫓',
              salads_raita: '🥗',
              drinks: '🥤',
              desserts: '🍨',
            };

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setAnimCycle((prev) => prev + 1);
                  const menuEl = document.getElementById('menu');
                  if (menuEl) {
                    menuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20 scale-[1.03]'
                    : 'bg-gray-100 dark:bg-[#151821] text-gray-700 dark:text-[#939dae] hover:bg-gray-200 dark:hover:bg-[#1e2330] hover:text-gray-950 dark:hover:text-[#fbf7ee] border border-gray-200 dark:border-[#222736]'
                }`}
              >
                <span>{categoryIcons[cat.id] || '🍽️'}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Responsive Grid: 2 columns on mobile so 4 posts fit comfortably on a single phone screen! */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-gray-50/80 dark:bg-[#141720]/80 border border-gray-200 dark:border-[#232838] rounded-2xl">
            <p className="text-sm font-semibold text-gray-900 dark:text-[#f4efe6]">No dishes found</p>
            <p className="text-xs text-gray-500 dark:text-[#7d8799] mt-1">Try another keyword or category</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setAnimCycle((prev) => prev + 1);
              }}
              className="mt-3 px-3 py-1.5 text-xs font-bold text-gray-950 bg-amber-500 rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {filteredItems.map((item, idx) => {
              const favorite = isFavorite(item.id);
              const priceDisplay =
                item.sizes && item.sizes.length > 1
                  ? `From Rs. ${item.basePrice.toLocaleString()}`
                  : `Rs. ${item.basePrice.toLocaleString()}`;

              return (
                <div
                  key={`${item.id}-${animCycle}`}
                  style={{ animationDelay: `${Math.min(idx * 45, 520)}ms` }}
                  className="group animate-dish-cascade dish-card-smooth bg-white/95 dark:bg-[#13161f]/95 border border-gray-200 dark:border-[#222736] hover:border-amber-500/50 dark:hover:border-[#d4af37]/40 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs"
                >
                  {/* Card Media */}
                  <div className="relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-[#181c26]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-85" />

                    {/* Delivery fee badge on top left */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[9px] sm:text-[10px] text-gray-200 flex items-center gap-1">
                      <Bike className="w-2.5 h-2.5 text-amber-400" />
                      <span>Fee: Rs. {selectedArea.fee}</span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        favorite
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                          : 'bg-black/60 text-gray-300 hover:text-white border border-white/10'
                      }`}
                      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-serif font-bold text-xs sm:text-base text-gray-900 dark:text-[#fbf7ee] group-hover:text-amber-600 dark:group-hover:text-[#d4af37] transition-colors leading-tight line-clamp-1">
                        {item.name}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#8c96a7] line-clamp-2 mt-1 leading-snug hidden sm:block">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Action Buttons: Add to Cart + Order Now */}
                    <div className="pt-2 border-t border-gray-100 dark:border-[#1e2330] flex flex-col space-y-2">
                      <span className="font-mono font-bold text-xs sm:text-sm text-amber-700 dark:text-[#d4af37] block leading-none">
                        {priceDisplay}
                      </span>

                      {/* Both Buttons: Add to Cart & Order Now (Matching User Request) */}
                      <div className="grid grid-cols-2 gap-1.5 w-full">
                        <button
                          type="button"
                          onClick={() => handleAddToCartClick(item)}
                          className="px-2 py-1.5 text-[10px] sm:text-xs font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-[#1a1d26] hover:bg-gray-200 dark:hover:bg-[#252a38] border border-gray-300 dark:border-gray-700 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-3 h-3 text-amber-500" />
                          <span className="truncate">Add to Cart</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOrderNowClick(item)}
                          className="px-2 py-1.5 text-[10px] sm:text-xs font-bold text-gray-950 bg-amber-500 hover:bg-amber-400 active:scale-95 rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs whitespace-nowrap cursor-pointer"
                          title="Order Now"
                        >
                          <span className="truncate">Order Now</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

