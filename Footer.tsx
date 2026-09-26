import React from 'react';
import { Phone, MapPin, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { useRestaurant } from '../context/RestaurantContext';

export const Footer: React.FC = () => {
  const { setIsTableReservationModalOpen, triggerSocialToast } = useRestaurant();

  return (
    <footer className="relative z-10 bg-[#08090b] border-t border-[#1a1d24] text-[#949eb0] text-xs pt-10 pb-24 lg:pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3.5">
              <img
                src={RESTAURANT_INFO.logoUrl}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/src/assets/images/al_jannat_logo.jpg';
                }}
                alt="Sandh Restaurant"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white/90 bg-[#14161f] shrink-0"
              />
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block leading-none uppercase">
                  SANDH
                </span>
                <span className="text-[11px] text-[#f59e0b] uppercase tracking-wider font-bold mt-1 block">
                  RESTAURANT
                </span>
              </div>
            </div>

            <p className="text-xs text-[#8e98aa] leading-relaxed">
              Authentic Karahi, Handi, charcoal BBQ, and tandoori specialties in Gulshan-e-Iqbal, Karachi.
            </p>

            <div className="pt-0.5">
              <span className="text-xs text-[#d4af37] font-serif italic font-semibold">
                {RESTAURANT_INFO.subtitle}
              </span>
            </div>

            {/* Social Media Buttons: Facebook, Instagram, TikTok */}
            <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
              <a
                href={RESTAURANT_INFO.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#111318] hover:bg-[#191c24] text-white border border-[#222632] font-bold text-xs flex items-center gap-2 transition-all"
              >
                <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href={RESTAURANT_INFO.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#111318] hover:bg-[#191c24] text-white border border-[#222632] font-bold text-xs flex items-center gap-2 transition-all"
              >
                <svg className="w-4 h-4 fill-[#E1306C] shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram</span>
              </a>

              <button
                type="button"
                onClick={() => triggerSocialToast('TikTok — Not Available')}
                className="px-3.5 py-2 rounded-xl bg-[#111318] hover:bg-[#191c24] text-white border border-[#222632] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                <span>TikTok</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#949eb0]">
              <li>
                <a href="#home" className="hover:text-[#d4af37] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#d4af37] transition-colors">
                  Menu &amp; Order
                </a>
              </li>
              <li>
                <a href="#deals" className="hover:text-[#d4af37] transition-colors">
                  Special Deals
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsTableReservationModalOpen(true)}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer text-left"
                >
                  Book a Table
                </button>
              </li>
              <li>
                <a href="#about" className="hover:text-[#d4af37] transition-colors">
                  About Sandh Restaurant
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#d4af37] transition-colors">
                  Contact &amp; Location
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              CONTACT &amp; LOCATION
            </h4>
            <ul className="space-y-3 text-xs text-[#949eb0]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{RESTAURANT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-white transition-colors">
                  {RESTAURANT_INFO.displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={RESTAURANT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#25D366] transition-colors"
                >
                  WhatsApp: {RESTAURANT_INFO.displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a
                  href={RESTAURANT_INFO.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Google Maps Route
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              OPENING HOURS
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#949eb0]">Friday</span>
                <span className="font-mono text-[#d0d7e2]">12 PM–12 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#949eb0]">Saturday</span>
                <span className="font-mono text-[#f59e0b] font-bold">12 PM–12 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#949eb0]">Sunday</span>
                <span className="font-mono text-[#f59e0b] font-bold">12 PM–12 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#949eb0]">Monday – Thursday</span>
                <span className="font-mono text-[#d0d7e2]">12 PM–12 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Website Notice Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1015] border border-[#1e222d] flex flex-col items-center justify-center gap-2 text-xs text-[#949eb0] shadow-xs text-center">
          <div className="flex items-center justify-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span className="leading-relaxed">
              <strong className="text-white">Demo Website</strong> — Orders and reservations are for demonstration purposes only.
            </span>
          </div>
          <div className="text-[11px] text-[#6c7686]">
            Sandh Restaurant · Gulshan-e-Iqbal, Karachi
          </div>
        </div>
      </div>
    </footer>
  );
};
