import React, { useState, useEffect } from 'react';
import { MapPin, Phone, MessageSquare, ExternalLink, Clock, Navigation } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { WEEKLY_SCHEDULE, getRestaurantHoursStatus } from '../utils/hours';
import { useRestaurant } from '../context/RestaurantContext';

export const LocationSection: React.FC = () => {
  const { triggerSocialToast } = useRestaurant();
  const [currentDay, setCurrentDay] = useState(() => new Date().getDay());
  const [hoursStatus, setHoursStatus] = useState(() => getRestaurantHoursStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDay(new Date().getDay());
      setHoursStatus(getRestaurantHoursStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const daysOrder = [6, 0, 1, 2, 3, 4, 5]; // Saturday to Friday

  return (
    <section id="contact" className="py-12 lg:py-20 bg-white/70 dark:bg-black/40 backdrop-blur-[1px] border-t border-gray-200 dark:border-[#1d2027] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-gray-200 dark:border-[#20242e]">
          <div className="text-xs font-bold text-amber-600 dark:text-[#d4af37] tracking-wider uppercase">
            Location & Hours
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-[#fbf7ee] mt-1">
            Find Sandh Restaurant
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-[#959eaf] mt-1 max-w-xl">
            Visit Sandh Restaurant or click Get Directions for the live Google Maps route.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact details and interactive actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Address Card */}
            <div className="p-6 bg-gray-50 dark:bg-[#14161c] border border-gray-200 dark:border-[#232734] rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#1c202a] border border-amber-200 dark:border-[#2c3241] flex items-center justify-center text-amber-600 dark:text-[#d4af37] shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-[#fbf7ee]">
                    Restaurant Address
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-[#cbd4e1] leading-relaxed">
                    {RESTAURANT_INFO.address}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <a
                  href={RESTAURANT_INFO.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs text-center cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="px-3.5 py-2.5 text-xs font-semibold text-gray-900 dark:text-[#f4efe6] bg-white dark:bg-[#1a1e27] hover:bg-gray-100 dark:hover:bg-[#232835] border border-gray-300 dark:border-[#2a3040] rounded-xl transition-colors flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4af37]" />
                  <span>{RESTAURANT_INFO.displayPhone}</span>
                </a>

                <a
                  href={RESTAURANT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 text-xs font-semibold text-gray-900 dark:text-[#f4efe6] bg-white dark:bg-[#1a1e27] hover:bg-gray-100 dark:hover:bg-[#232835] border border-gray-300 dark:border-[#2a3040] rounded-xl transition-colors flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>
              {/* Social Links Row */}
              <div className="pt-2 border-t border-gray-200 dark:border-[#232836] flex flex-wrap items-center gap-2">
                <a
                  href={RESTAURANT_INFO.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 text-xs font-bold bg-[#1877F2]/15 hover:bg-[#1877F2]/25 text-[#4e9af7] border border-[#1877F2]/30 rounded-xl transition-all"
                >
                  Facebook Page
                </a>
                <a
                  href={RESTAURANT_INFO.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 text-xs font-bold bg-pink-500/15 hover:bg-pink-500/25 text-pink-400 border border-pink-500/30 rounded-xl transition-all"
                >
                  Instagram
                </a>
                <button
                  type="button"
                  onClick={() => triggerSocialToast('TikTok — Not Available')}
                  className="px-3 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/15 rounded-xl transition-all cursor-pointer"
                >
                  TikTok
                </button>
              </div>
            </div>

            {/* Embedded Google Maps Placeholder link */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-[#232734] bg-gray-100 dark:bg-[#151821] shadow-xs">
              <a
                href={RESTAURANT_INFO.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="block relative h-48 sm:h-56 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-gray-200/50 dark:to-black/40 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1b1f2a] border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-[#d4af37] mb-2 group-hover:scale-110 transition-transform shadow-xs">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="font-serif font-bold text-sm text-gray-900 dark:text-[#fbf7ee]">
                    Sandh Restaurant · Gulshan-e-Iqbal, Karachi
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-[#7f8899] mt-0.5">
                    Click to view live interactive route on Google Maps
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Weekly Schedule */}
          <div className="lg:col-span-6">
            <div className="p-6 bg-gray-50 dark:bg-[#14161c] border border-gray-200 dark:border-[#232734] rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#212532]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-[#d4af37]" />
                  <h3 className="font-serif font-bold text-base text-gray-900 dark:text-[#fbf7ee]">
                    Opening Hours
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hoursStatus.isOpen ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-gray-900 dark:text-[#f4efe6] font-semibold">{hoursStatus.statusLabel}</span>
                </div>
              </div>

              {/* Table of days */}
              <div className="divide-y divide-gray-200 dark:divide-[#1e222c] text-xs">
                {daysOrder.map((dayIdx) => {
                  const schedule = WEEKLY_SCHEDULE[dayIdx];
                  const isToday = currentDay === dayIdx;
                  return (
                    <div
                      key={schedule.dayName}
                      className={`py-3 px-3 rounded-lg flex items-center justify-between transition-colors ${
                        isToday
                          ? 'bg-white dark:bg-[#1d212b] border border-amber-500/30 font-bold shadow-2xs'
                          : 'hover:bg-white/60 dark:hover:bg-[#181b22]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={isToday ? 'text-amber-700 dark:text-[#d4af37]' : 'text-gray-700 dark:text-[#c6cedb]'}>
                          {schedule.dayName}
                        </span>
                        {isToday && (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-800 dark:text-[#d4af37] rounded font-bold">
                            Today
                          </span>
                        )}
                      </div>
                      <span className={`font-mono ${isToday ? 'text-gray-950 dark:text-[#fbf7ee]' : 'text-gray-500 dark:text-[#8b95a5]'}`}>
                        {schedule.displayHours}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-[11px] text-gray-500 dark:text-[#717a8a] border-t border-gray-200 dark:border-[#1e222c]">
                * Dine-in seating and online deliveries operate continuously throughout operational hours.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
