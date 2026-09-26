import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Bike, Calendar } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { useRestaurant } from '../context/RestaurantContext';

const HERO_SLIDES = [
  {
    id: 1,
    title1: 'SANDH',
    title2: 'SPECIAL KOYLA KARAHI',
    dishName: 'Chicken Koyla Karahi',
    badge: '100% Desi Ghee & Fresh Meat',
    eta: '30 Min',
    price: 'From Rs. 1,300',
    description: 'Experience the unique smoky aroma of charcoal in this rich tomato puree gravy karahi cooked in pure butter & desi ghee.',
    image: RESTAURANT_INFO.heroFirstImageUrl,
    fallbackImage: '/src/assets/images/hero_slide_1.jpg',
    tag: 'SIGNATURE KARAHI',
  },
  {
    id: 2,
    title1: 'AUTHENTIC DESI',
    title2: 'TRADITIONAL TASTE',
    dishName: 'Makhni Karahi & Handi',
    badge: 'Pure Ghee & Fresh Spices',
    eta: '25 Min',
    price: 'From Rs. 1,250',
    description: 'Fresh chicken and mutton braised with thick dairy yogurt, green chillies, and freshly roasted whole cumin.',
    image: '/src/assets/images/hero_slide_2.jpg',
    tag: 'CHEF SPECIAL',
  },
  {
    id: 3,
    title1: 'CHARCOAL BBQ',
    title2: 'HOT FROM TANDOOR',
    dishName: 'Sizzling Seekh Kabab & Boti',
    badge: 'Flame-Grilled Over Real Coals',
    eta: '20 Min',
    price: 'From Rs. 580',
    description: 'Melt-in-mouth succulent seekh kababs and smoky chicken boti marinated in authentic Mughlai spices.',
    image: '/src/assets/images/hero_slide_3.jpg',
    tag: 'CHARCOAL SMOKED',
  },
  {
    id: 4,
    title1: 'ROYAL FEAST',
    title2: 'SPIRIT OF KARACHI',
    dishName: 'Special Handi & Paratha',
    badge: 'Sealed Earthenware Pot',
    eta: '35 Min',
    price: 'From Rs. 1,450',
    description: 'Slow-simmered rich boneless gravies served piping hot with fresh flaky lacha parathas and roghni naan.',
    image: '/src/assets/images/hero_slide_4.jpg',
    tag: 'ROYAL FLAVOURS',
  },
  {
    id: 5,
    title1: 'SIZZLING PLATTERS',
    title2: 'PURE CRAVINGS',
    dishName: 'Family BBQ & Karahi Platter',
    badge: 'Fresh Daily Meat Guaranteed',
    eta: '30 Min',
    price: 'From Rs. 2,100',
    description: 'Complete royal dinner spread with charcoal grilled tikka, seekh kababs, hot tandoori naan, and zeera raita.',
    image: '/src/assets/images/hero_slide_5.jpg',
    tag: 'FAMILY COMBO',
  },
];

export const Hero: React.FC = () => {
  const { setIsTableReservationModalOpen } = useRestaurant();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [homeAnimKey, setHomeAnimKey] = useState(1);

  // Auto-slide every 3 seconds without any pause or manual advance buttons
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleSectionNav = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail === 'home') {
        setHomeAnimKey((prev) => prev + 1);
      }
    };
    window.addEventListener('section-navigate', handleSectionNav);
    return () => window.removeEventListener('section-navigate', handleSectionNav);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      id="home"
      className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] h-[calc(92dvh-4rem)] max-h-[860px] overflow-hidden bg-[#07080b] text-white flex flex-col justify-between border-b border-[#181a24] select-none"
    >
      {/* FULL-SECTION SLIDING BACKGROUND IMAGES (Spans 100% of the entire Hero Section) */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              idx === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={item.image}
              onError={(e) => {
                if ('fallbackImage' in item && item.fallbackImage) {
                  (e.currentTarget as HTMLImageElement).src = item.fallbackImage;
                }
              }}
              alt={item.dishName}
              className="w-full h-full object-cover object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
              referrerPolicy="no-referrer"
            />
          </div>
        ))}

        {/* Cinematic Gradient Vignettes for Ultra-Legible Content */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080b]/95 via-[#07080b]/75 sm:via-[#07080b]/60 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-transparent to-black/40" />
      </div>

      {/* Main Content Overlay */}
      <div
        key={`hero-content-${homeAnimKey}`}
        className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-6 flex-1 flex flex-col justify-between animate-hero-return"
      >
        
        {/* Top Tag and Delivery ETA Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-gray-950 font-mono text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-md">
              {slide.tag}
            </span>
            <span className="hidden sm:inline-block text-xs text-gray-200 font-semibold bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              {slide.badge}
            </span>
          </div>

          {/* Floating ETA Glass Card */}
          <div className="backdrop-blur-md bg-black/60 border border-white/20 text-white rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-2xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] text-gray-300 font-medium leading-none">
                Deliver in
              </span>
              <span className="block text-sm sm:text-base font-bold font-mono text-white leading-tight">
                {slide.eta}
              </span>
            </div>
          </div>
        </div>

        {/* Center Main Typography & Quality Badge */}
        <div className="max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-6 my-auto pt-4 sm:pt-6">
          {/* Giant Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tight leading-[0.95] text-white uppercase drop-shadow-2xl">
            <span className="block text-white">
              {slide.title1}
            </span>
            <span className="block text-amber-400 drop-shadow-md">
              {slide.title2}
            </span>
          </h1>

          {/* Circular Stamp + Subtitle */}
          <div className="flex items-center gap-4 sm:gap-5 pt-1">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-emerald-400/80 bg-emerald-950/80 p-1 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md shrink-0">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-emerald-400 tracking-wider">
                Authentic
              </span>
              <span className="text-xs sm:text-sm font-black text-white leading-tight">
                100%
              </span>
              <span className="text-[8px] sm:text-[9px] font-semibold text-emerald-300 leading-tight">
                Fresh Meat
              </span>
            </div>

            <p className="text-xs sm:text-base text-gray-200 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none max-w-lg drop-shadow-md">
              {slide.description}
            </p>
          </div>

          {/* Price & CTA Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#menu"
              className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white hover:bg-gray-100 active:scale-95 text-gray-950 font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Order Now</span>
              <ArrowUpRight className="w-4 h-4 text-gray-950 stroke-[2.5]" />
            </a>

            <a
              href="#menu"
              className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 active:scale-95 text-white font-bold text-xs sm:text-sm backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Menu</span>
              <ArrowUpRight className="w-4 h-4 text-white stroke-[2.5]" />
            </a>

            <button
              type="button"
              onClick={() => setIsTableReservationModalOpen(true)}
              className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3d066] to-[#c59b27] hover:brightness-105 active:scale-95 text-gray-950 font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-gray-950 stroke-[2.5]" />
              <span>Table Reservation</span>
            </button>

            <span className="text-sm sm:text-base font-mono font-bold text-amber-400 ml-2 drop-shadow-md">
              {slide.price}
            </span>
          </div>
        </div>

        {/* Bottom 3-Second Auto-Slide Progress Indicators (No buttons to advance) */}
        <div className="pt-4 border-t border-white/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <div
                key={idx}
                className="h-1.5 rounded-full overflow-hidden transition-all duration-300 bg-white/20"
                style={{
                  width: idx === currentSlide ? '38px' : '16px',
                }}
              >
                {idx === currentSlide && (
                  <div
                    key={currentSlide}
                    className="h-full bg-amber-400 rounded-full animate-[progress_3s_linear]"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-300 font-mono font-semibold">
            <span className="text-amber-400 font-bold">{currentSlide + 1}</span>
            <span className="text-gray-500"> / {HERO_SLIDES.length}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
