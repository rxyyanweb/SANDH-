import React, { useRef } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { DELIVERY_AREAS, MENU_ITEMS } from '../data/restaurantData';
import { MenuItem } from '../types/restaurant';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    cart,
    orderType,
    setOrderType,
    selectedAreaId,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    addToCart,
  } = useRestaurant();

  const carouselRef = useRef<HTMLDivElement>(null);

  if (!isCartOpen) return null;

  const selectedArea = DELIVERY_AREAS.find((a) => a.id === selectedAreaId) || DELIVERY_AREAS[0];

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleAddMoreItems = () => {
    setIsCartOpen(false);
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 170;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Popular items from Image 3
  const popularDishes = [
    MENU_ITEMS.find((m) => m.id === 'isfahani_boti') || {
      id: 'isfahani_boti',
      name: 'Isfahani Boti',
      basePrice: 1000,
      image: '/src/assets/images/bbq_seekh_tikka_1790346568096.jpg',
      categoryId: 'bbq',
      description: 'Persian spiced boneless chicken skewers.',
    },
    MENU_ITEMS.find((m) => m.id === 'crispy_fries') || {
      id: 'crispy_fries',
      name: 'Fries',
      basePrice: 350,
      image: '/src/assets/images/tikka_boti_platter_1790349472788.jpg',
      categoryId: 'bbq',
      description: 'Golden potato fries.',
    },
    MENU_ITEMS.find((m) => m.id === 'shahi_tikka') || {
      id: 'shahi_tikka',
      name: 'Shahi Tikka',
      basePrice: 530,
      image: '/src/assets/images/tikka_boti_platter_1790349472788.jpg',
      categoryId: 'bbq',
      description: 'Charbroiled chicken quarter.',
    },
    MENU_ITEMS.find((m) => m.id === 'crispy_lacha_paratha') || {
      id: 'crispy_lacha_paratha',
      name: 'Lacha Paratha',
      basePrice: 90,
      image: '/src/assets/images/tandoori_naan_basket_1790346599982.jpg',
      categoryId: 'tandoor',
      description: 'Layered flaky paratha.',
    },
  ] as MenuItem[];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCartOpen(false);
      }}
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
    >
      <div className="w-full max-w-[420px] bg-[#1e2025] text-white h-full flex flex-col shadow-2xl overflow-hidden border-l border-gray-800 animate-drawer-slide">
        
        {/* Top Header (Matching Image 3) */}
        <div className="p-4 sm:p-5 border-b border-[#2d3039] flex items-center justify-between shrink-0">
          <h2 className="font-bold text-xl text-white tracking-tight">
            Your Cart
          </h2>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="bg-black hover:bg-gray-900 text-xs font-semibold text-white px-3 py-1.5 rounded-full border border-gray-700 hover:border-gray-500 transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#282b33] flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">Your cart is empty</p>
              <p className="text-xs text-gray-400 max-w-xs">
                Browse our specialty dishes and add items to your cart.
              </p>
              <button
                onClick={handleAddMoreItems}
                className="mt-2 px-4 py-2 text-xs font-bold text-white bg-black border border-gray-700 hover:border-gray-500 rounded-full transition-colors cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items List (Matching Image 3) */}
              {cart.map((item) => {
                // Find matching dish for thumbnail if available
                const matchedDish = MENU_ITEMS.find((m) => m.id === item.menuItemId);
                const dishImg = matchedDish?.image || '/src/assets/images/hero_karahi_pot_1790346550068.jpg';

                return (
                  <div key={item.cartItemId} className="pb-3 border-b border-gray-800/80 space-y-2">
                    {/* Item row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={dishImg}
                          alt={item.name}
                          className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover bg-gray-900 border border-gray-800 shrink-0"
                        />
                        <div className="leading-tight">
                          <h3 className="font-bold text-sm text-white line-clamp-1">
                            {item.name}
                          </h3>
                          {item.selectedSize && (
                            <span className="text-xs text-gray-400 block mt-0.5">
                              {item.selectedSize}
                            </span>
                          )}
                          <span className="font-bold text-xs text-white block mt-0.5">
                            Rs.{item.unitPrice}
                          </span>
                        </div>
                      </div>

                      {/* Stepper pill on right [🗑️ 1 +] */}
                      <div className="flex items-center gap-2 bg-black border border-gray-800 rounded-full px-2.5 py-1 shrink-0">
                        {item.quantity === 1 ? (
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        )}

                        <span className="w-4 text-center font-bold text-xs text-white font-mono">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Add-ons list in light gray pills (Matching Image 3) */}
                    {item.addons && item.addons.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-semibold text-gray-400 block">Add Ons</span>
                        {item.addons.map((addon) => (
                          <div
                            key={addon.addonId}
                            className="bg-[#e2e8f0] text-gray-900 text-xs px-3 py-1 rounded-full flex justify-between items-center font-medium"
                          >
                            <span>{addon.name}</span>
                            <span className="font-mono text-[11px]">
                              {addon.quantity}x (Rs. {addon.price * addon.quantity})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[11px] text-gray-400 italic pl-1">
                        "{item.specialInstructions}"
                      </p>
                    )}
                  </div>
                );
              })}

              {/* "+ Add More Items" Dashed Button (Matching Image 3) */}
              <button
                type="button"
                onClick={handleAddMoreItems}
                className="w-full py-2.5 border-2 border-dashed border-gray-600 hover:border-gray-400 bg-transparent rounded-xl text-center text-gray-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More Items</span>
              </button>

              {/* "Popular with your order" Carousel (Matching Image 3) */}
              <div className="pt-2 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white leading-tight">
                      Popular with your order
                    </h4>
                    <span className="text-xs text-gray-400 block">
                      Customers often buy these together
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => scrollCarousel('left')}
                      className="w-6 h-6 rounded-md bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors cursor-pointer"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => scrollCarousel('right')}
                      className="w-6 h-6 rounded-md bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors cursor-pointer"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scrolling Items */}
                <div
                  ref={carouselRef}
                  className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none"
                >
                  {popularDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="w-28 sm:w-32 shrink-0 bg-[#16181e] border border-gray-800 rounded-xl p-2 space-y-1.5 text-left"
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-900">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Quick Add (+) Circle Button matching Image 3 */}
                        <button
                          type="button"
                          onClick={() => addToCart(dish, undefined, [], '', 1)}
                          className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/20 shadow-md transition-transform active:scale-90 cursor-pointer"
                          title={`Add ${dish.name}`}
                          aria-label={`Add ${dish.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <div className="font-bold text-xs text-white truncate">
                          Rs.{dish.basePrice}.00
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">
                          {dish.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer & Checkout Section (Matching Image 3) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#17181d] border-t border-gray-800 space-y-3 shrink-0">
            {/* Price Summary */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Total</span>
                <span className="font-mono text-white">Rs. {cartSubtotal}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-white pt-1">
                <span>Grand Total</span>
                <span className="font-mono text-base">Rs. {cartTotal}</span>
              </div>
            </div>

            {/* Big Black Checkout Button (Matching Image 3) */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-black hover:bg-gray-900 active:scale-[0.99] text-white font-bold text-sm rounded-xl border border-gray-700 shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Checkout Rs. {cartTotal}</span>
            </button>

            {/* Delivery / Pickup / Dine-in Segmented Control */}
            <div className="bg-[#121419] p-1 rounded-xl flex items-center gap-1 text-xs font-bold border border-gray-800">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-amber-500 text-gray-950 font-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                DELIVERY
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-amber-500 text-gray-950 font-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                PICKUP
              </button>

              <button
                type="button"
                onClick={() => setOrderType('dinein')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  orderType === 'dinein'
                    ? 'bg-amber-500 text-gray-950 font-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                DINE-IN
              </button>
            </div>

            {/* Footer Collection Notice */}
            <div className="text-[11px] text-gray-400 text-center pt-0.5 leading-relaxed">
              {orderType === 'pickup' ? (
                <span>
                  Takeaway Branch Location:{' '}
                  <strong className="text-white block sm:inline">
                    Allamah Basheer Ahmed Usmani Rd, Ayaz Town Shop #3, A 286، near Mochi More, Block 2 Gulshan-e-Iqbal, Karachi, Pakistan
                  </strong>
                </span>
              ) : orderType === 'dinein' ? (
                <span>
                  Dine-in Branch:{' '}
                  <strong className="text-white">
                    Allamah Basheer Ahmed Usmani Rd, Ayaz Town Shop #3, A 286، near Mochi More, Block 2 Gulshan-e-Iqbal, Karachi, Pakistan
                  </strong>
                </span>
              ) : (
                <span>
                  Delivery to <strong className="text-white">{selectedArea.name}</strong> (Fee: Rs. {selectedArea.fee})
                </span>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
