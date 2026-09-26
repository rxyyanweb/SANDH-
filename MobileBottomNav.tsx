import React from 'react';
import { Home, Utensils, Calendar, ShoppingBag, Clock, ArrowRight } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const MobileBottomNav: React.FC = () => {
  const {
    cartItemCount,
    cartTotal,
    cartBump,
    setIsCartOpen,
    setIsOrdersOpen,
    setIsTableReservationModalOpen,
    orders,
  } = useRestaurant();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 safe-area-pb pointer-events-none">
      {/* Floating Mini Cart Bar */}
      {cartItemCount > 0 && (
        <div className="px-3 pb-2 pointer-events-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-105 active:scale-[0.99] text-gray-950 rounded-xl font-bold text-xs flex items-center justify-between shadow-xl shadow-black/30 transition-all cursor-pointer border border-amber-300/60"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-gray-950 text-amber-400 flex items-center justify-center text-xs font-mono font-bold shadow-xs">
                {cartItemCount}
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[10px] text-gray-950/80 font-bold uppercase tracking-wider">
                  View Cart
                </span>
                <span className="text-xs font-mono font-black">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black">
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main Bottom Tabs */}
      <div className="bg-white/95 dark:bg-[#0e1013]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#232731] px-2 py-1.5 pointer-events-auto transition-colors duration-300">
        <div className="flex items-center justify-around">
          <a
            href="#home"
            className="flex flex-col items-center justify-center p-1.5 text-xs text-gray-500 dark:text-[#9ca3af] hover:text-amber-600 dark:hover:text-[#d4af37] focus:text-amber-600 active:scale-90 transition-all duration-200"
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Home</span>
          </a>

          <a
            href="#menu"
            className="flex flex-col items-center justify-center p-1.5 text-xs text-gray-500 dark:text-[#9ca3af] hover:text-amber-600 dark:hover:text-[#d4af37] focus:text-amber-600 active:scale-90 transition-all duration-200"
          >
            <Utensils className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Menu</span>
          </a>

          <button
            onClick={() => setIsTableReservationModalOpen(true)}
            className="flex flex-col items-center justify-center p-1.5 text-xs text-gray-500 dark:text-[#9ca3af] hover:text-amber-600 dark:hover:text-[#d4af37] focus:text-amber-600 active:scale-90 transition-all duration-200 cursor-pointer"
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Book</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className={`flex flex-col items-center justify-center p-1.5 text-xs text-amber-500 relative transition-transform cursor-pointer ${
              cartBump ? 'animate-cart-bounce scale-110' : ''
            }`}
          >
            <div className="relative">
              <ShoppingBag className={`w-5 h-5 mb-0.5 ${cartBump ? 'text-amber-400 stroke-[2.5]' : ''}`} />
              {cartItemCount > 0 && (
                <span className={`absolute -top-1 -right-2 px-1 min-w-4 h-4 text-gray-950 font-mono text-[9px] font-bold rounded-full flex items-center justify-center ${
                  cartBump ? 'bg-amber-400 animate-bounce' : 'bg-amber-500'
                }`}>
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-gray-900 dark:text-[#f4efe6]">Cart</span>
          </button>

          <button
            onClick={() => setIsOrdersOpen(true)}
            className="flex flex-col items-center justify-center p-1.5 text-xs text-gray-500 dark:text-[#9ca3af] hover:text-amber-600 dark:hover:text-[#d4af37] focus:text-amber-600 transition-colors relative cursor-pointer"
          >
            <div className="relative">
              <Clock className="w-5 h-5 mb-0.5" />
              {orders.length > 0 && (
                <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-medium">Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};
