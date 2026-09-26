import React from 'react';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { MENU_ITEMS } from '../data/restaurantData';

export const FavoritesModal: React.FC = () => {
  const {
    isFavoritesOpen,
    setIsFavoritesOpen,
    favorites,
    toggleFavorite,
    setCustomizingItem,
  } = useRestaurant();

  if (!isFavoritesOpen) return null;

  const favoriteItems = MENU_ITEMS.filter((item) => favorites.includes(item.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overscroll-contain">
      <div
        className="relative w-full max-w-xl max-h-[88dvh] sm:max-h-[90dvh] flex flex-col bg-white dark:bg-[#121419] border border-gray-200 dark:border-[#272b38] rounded-2xl shadow-2xl overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorites-title"
      >
        {/* Fixed Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-[#1f232d] flex items-center justify-between bg-white dark:bg-[#121419] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-[#181b22] border border-rose-200 dark:border-[#2b303d] flex items-center justify-center text-rose-500">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 id="favorites-title" className="text-lg sm:text-xl font-serif font-bold text-gray-900 dark:text-[#fbf7ee]">
                My Favorites
              </h2>
              <p className="text-xs text-gray-500 dark:text-[#8690a0]">
                {favoriteItems.length} {favoriteItems.length === 1 ? 'dish' : 'dishes'} saved
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFavoritesOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-[#f4efe6] hover:bg-gray-100 dark:hover:bg-[#1a1d26] rounded-lg transition-colors cursor-pointer"
            aria-label="Close favorites"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {favoriteItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#181a22] border border-gray-200 dark:border-[#272b36] flex items-center justify-center text-gray-400 mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-[#fbf7ee]">No favorites saved yet</p>
              <p className="text-xs text-gray-500 dark:text-[#848d9c] max-w-xs mx-auto">
                Tap the heart icon on any dish in our menu to save it here for fast re-ordering.
              </p>
            </div>
          ) : (
            favoriteItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-gray-50 dark:bg-[#161820] border border-gray-200 dark:border-[#242834] rounded-xl flex items-center justify-between gap-3 hover:border-gray-300 dark:hover:border-[#383f50] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-[#1c202a]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#1c202a] border border-gray-200 dark:border-[#292e3c] flex items-center justify-center text-xs font-serif font-bold text-amber-600 dark:text-[#d4af37]">
                      AJ
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-[#fbf7ee] leading-tight">
                      {item.name}
                    </h4>
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-[#d4af37] block mt-0.5">
                      Rs. {item.basePrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={() => {
                      setIsFavoritesOpen(false);
                      setCustomizingItem(item);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-gray-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Order Now</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fixed Sticky Footer */}
        <div className="p-3.5 sm:p-4 bg-gray-50 dark:bg-[#141720] border-t border-gray-200 dark:border-[#1f232d] shrink-0 flex items-center justify-end">
          <button
            onClick={() => setIsFavoritesOpen(false)}
            className="px-5 py-2 bg-gray-200 dark:bg-[#202532] hover:bg-gray-300 dark:hover:bg-[#2a3040] text-gray-800 dark:text-[#f4efe6] font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
          >
            Close Favorites
          </button>
        </div>
      </div>
    </div>
  );
};
