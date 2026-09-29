import React from 'react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { Utensils, Bike, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 lg:py-20 bg-white/70 dark:bg-black/40 backdrop-blur-[1px] border-t border-gray-200 dark:border-[#1d2027] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-[#1a1d24] border border-amber-200 dark:border-[#262b37] rounded-md text-xs text-amber-700 dark:text-[#d4af37] font-semibold">
            <span>About Us</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-[#fbf7ee] tracking-tight">
            About Sandh Restaurant
          </h2>

          {/* Factual restaurant text */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-[#14161c] border border-gray-200 dark:border-[#242834] shadow-xs">
            <p className="text-base sm:text-lg font-serif text-gray-900 dark:text-[#fbf7ee] leading-relaxed italic">
              "{RESTAURANT_INFO.aboutText}"
            </p>
          </div>

          {/* 3 Core pillars: Dine-in, Takeaway, Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 bg-gray-50 dark:bg-[#14161c] border border-gray-200 dark:border-[#222632] rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-[#1c202a] border border-amber-200 dark:border-[#2b303d] flex items-center justify-center text-amber-600 dark:text-[#d4af37]">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-[#fbf7ee]">Dine-In</h4>
              <p className="text-xs text-gray-600 dark:text-[#8e98aa] leading-relaxed">
                Comfortable family seating hall on Allama Shabbir Ahmed Usmani Road, Gulshan-e-Iqbal.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#14161c] border border-gray-200 dark:border-[#222632] rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-[#1c202a] border border-amber-200 dark:border-[#2b303d] flex items-center justify-center text-amber-600 dark:text-[#d4af37]">
                <Utensils className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-[#fbf7ee]">Takeaway & Counter Pickup</h4>
              <p className="text-xs text-gray-600 dark:text-[#8e98aa] leading-relaxed">
                Order in advance for rapid counter pickup with payment upon collection.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#14161c] border border-gray-200 dark:border-[#222632] rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-[#1c202a] border border-amber-200 dark:border-[#2b303d] flex items-center justify-center text-amber-600 dark:text-[#d4af37]">
                <Bike className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-[#fbf7ee]">Doorstep Delivery</h4>
              <p className="text-xs text-gray-600 dark:text-[#8e98aa] leading-relaxed">
                Coverage across GGulshan-e-Iqbal, Johar, and surrounding Karachi sectors!.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
