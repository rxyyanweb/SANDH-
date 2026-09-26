import React from 'react';
import { Tag, Flame, Clock } from 'lucide-react';

export const DealsSection: React.FC = () => {
  return (
    <section id="deals" className="py-12 lg:py-16 bg-white/70 dark:bg-black/40 backdrop-blur-[1px] border-t border-gray-200 dark:border-[#1d2027] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#20242e]">
          <div>
            <div className="text-xs font-bold text-amber-600 dark:text-[#d4af37] tracking-wider uppercase">
              Promotions & Bundles
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-[#fbf7ee] mt-1">
              Special Deals
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-[#959eaf] mt-1">
              Curated dining promotions and seasonal value offerings.
            </p>
          </div>
        </div>

        {/* Elegant placeholder cards respecting user constraint: "Do not invent discounts. Say 'Special offers coming soon'" */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-[#13151b] border border-gray-200 dark:border-[#232733] flex flex-col justify-between space-y-5 hover:border-amber-400 transition-colors shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#1c202a] border border-amber-200 dark:border-[#2b303d] flex items-center justify-center text-amber-600 dark:text-[#d4af37]">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-[#fbf7ee]">
                Family Karahi Feast
              </h3>
              <p className="text-xs text-gray-600 dark:text-[#8e98aa] leading-relaxed">
                Special offers coming soon
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-[#1d212b] text-[11px] text-gray-500 dark:text-[#6f7888] flex items-center justify-between">
              <span>Sandh Signature Selection</span>
              <span className="font-mono text-amber-600 dark:text-[#d4af37] font-semibold">Coming Soon</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-[#13151b] border border-gray-200 dark:border-[#232733] flex flex-col justify-between space-y-5 hover:border-amber-400 transition-colors shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#1c202a] border border-amber-200 dark:border-[#2b303d] flex items-center justify-center text-amber-600 dark:text-[#d4af37]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-[#fbf7ee]">
                Charcoal BBQ Platter Combo
              </h3>
              <p className="text-xs text-gray-600 dark:text-[#8e98aa] leading-relaxed">
                Special offers coming soon
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-[#1d212b] text-[11px] text-gray-500 dark:text-[#6f7888] flex items-center justify-between">
              <span>Sizzling Skewers & Fresh Naan</span>
              <span className="font-mono text-amber-600 dark:text-[#d4af37] font-semibold">Coming Soon</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-[#13151b] border border-gray-200 dark:border-[#232733] flex flex-col justify-between space-y-5 hover:border-amber-400 transition-colors shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#1c202a] border border-amber-200 dark:border-[#2b303d] flex items-center justify-center text-amber-600 dark:text-[#d4af37]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-[#fbf7ee]">
                Weekend Matka Biryani Special
              </h3>
              <p className="text-xs text-gray-600 dark:text-[#8e98aa] leading-relaxed">
                Special offers coming soon
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-[#1d212b] text-[11px] text-gray-500 dark:text-[#6f7888] flex items-center justify-between">
              <span>Clay Pot Dum Cooking</span>
              <span className="font-mono text-amber-600 dark:text-[#d4af37] font-semibold">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
