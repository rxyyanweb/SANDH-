import React from 'react';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const ReviewsSection: React.FC = () => {
  const { reviews, setIsOrdersOpen, orders } = useRestaurant();

  return (
    <section id="reviews" className="py-12 lg:py-20 bg-gray-50/75 dark:bg-black/50 backdrop-blur-[1px] border-t border-gray-200 dark:border-[#1d2027] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#20242e]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-600 dark:text-[#d4af37] tracking-wider uppercase">
              <span>Customer Feedback</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Total Reviews: 4.6(14)</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-[#fbf7ee] mt-1">
              Customer Reviews
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-[#959eaf] mt-1 max-w-xl">
              Authentic feedback from verified customers. Reviews can only be submitted after receiving a completed order.
            </p>
          </div>

          {/* Action */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-2 text-xs font-bold text-amber-600 dark:text-[#f3ca52] bg-amber-50 dark:bg-[#1a1d26] border border-amber-200 dark:border-[#d4af37]/30 rounded-xl flex items-center gap-1.5 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>Total Reviews: 4.6(14)</span>
            </div>
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-gray-900 dark:text-[#f4efe6] bg-white dark:bg-[#161820] hover:bg-gray-100 dark:hover:bg-[#202430] border border-gray-300 dark:border-[#272b38] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4af37]" />
              <span>Review Completed Order</span>
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-white dark:bg-[#13151b] border border-gray-200 dark:border-[#212532] rounded-2xl max-w-2xl mx-auto space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-[#1c202a] border border-amber-200 dark:border-[#2b303d] flex items-center justify-center text-amber-600 dark:text-[#d4af37] mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-[#fbf7ee]">
              No Customer Reviews Submitted Yet
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-[#8c96a7] leading-relaxed max-w-md mx-auto">
              In accordance with our strict verification policy, reviews can only be submitted by customers who have placed and completed an order.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsOrdersOpen(true)}
                className="px-4 py-2 text-xs font-bold text-gray-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                View My Orders ({orders.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-white dark:bg-[#13151c] border border-gray-200 dark:border-[#232838] rounded-2xl space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-[#fbf7ee]">{rev.customerName}</h4>
                    <span className="text-[10px] text-gray-500">Order #{rev.orderNumber}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-700 dark:text-[#c4cddb] leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2 border-t border-gray-100 dark:border-[#1e2330] flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Dine-in / Delivery Customer</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
