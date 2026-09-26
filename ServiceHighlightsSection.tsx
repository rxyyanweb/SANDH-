import React from 'react';
import { Bike, Flame, ShieldCheck, CalendarCheck } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { DELIVERY_AREAS } from '../data/restaurantData';

export const ServiceHighlightsSection: React.FC = () => {
  const { selectedAreaId } = useRestaurant();
  const selectedArea = DELIVERY_AREAS.find((a) => a.id === selectedAreaId) || DELIVERY_AREAS[0];

  const highlights = [
    {
      icon: Bike,
      title: `Delivery to ${selectedArea.name}`,
      subtitle: `Fee: Rs. ${selectedArea.fee} · Estimated: ${selectedArea.estimatedTime}`,
      description: 'Reliable doorstep delivery across Gulshan-e-Iqbal, Johar, and adjacent Karachi areas.',
    },
    {
      icon: Flame,
      title: 'Fresh Wok & Charcoal Grill',
      subtitle: 'Prepared Fresh to Order',
      description: 'Slow-simmered in black cast-iron woks and skewered over authentic hot coals.',
    },
    {
      icon: ShieldCheck,
      title: 'Cash on Delivery Available',
      subtitle: 'Doorstep or Pickup',
      description: 'Pay cash upon collecting your order at your doorstep or from the restaurant counter.',
    },
    {
      icon: CalendarCheck,
      title: 'Advance Table Reservations',
      subtitle: 'Dine-in with Family & Friends',
      description: 'Book your table online with scheduled arrival during operating hours (12 PM – 12 AM).',
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-[#090b10] border-y border-[#181c28] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-[#111420] border border-[#1d2334] flex flex-col justify-between space-y-4 hover:border-amber-400/50 hover:bg-[#141826] transition-all duration-200 shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-xs font-semibold text-amber-400 block mt-0.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
