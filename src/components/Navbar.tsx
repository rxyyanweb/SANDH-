import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Phone,
  Calendar,
  Clock,
  Heart,
  MapPin,
  Bike,
  Store,
  Menu as MenuIcon,
  X,
  Search,
  User,
  ChevronDown,
  Bell,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { RESTAURANT_INFO, DELIVERY_AREAS } from '../data/restaurantData';
import { getRestaurantHoursStatus } from '../utils/hours';

export const Navbar: React.FC = () => {
  const {
    cartItemCount,
    cartTotal,
    cartBump,
    orderType,
    setOrderType,
    selectedAreaId,
    setSelectedAreaId,
    setIsCartOpen,
    setIsOrdersOpen,
    setIsBookingsOpen,
    setIsTableReservationModalOpen,
    setIsUpdatesModalOpen,
    setIsFavoritesOpen,
    favorites,
    orders,
    bookings,
    posts,
  } = useRestaurant();

  const [hoursStatus, setHoursStatus] = useState(() => getRestaurantHoursStatus());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHoursStatus(getRestaurantHoursStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const selectedArea = DELIVERY_AREAS.find((a) => a.id === selectedAreaId) || DELIVERY_AREAS[0];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090a0e]/95 backdrop-blur-md shadow-2xl border-b border-[#181a24]'
          : 'bg-[#0a0b0f] border-b border-[#141620]'
      }`}
    >
      {/* Top Micro Info Bar */}
      <div className="bg-[#050608] border-b border-[#12141c] px-3 sm:px-6 py-1.5 text-[11px] text-gray-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                hoursStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-white font-semibold">
              {hoursStatus.statusLabel}
            </span>
            <span className="hidden sm:inline text-gray-400">
              · {hoursStatus.detailText}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-amber-400">
              <MapPin className="w-3.5 h-3.5" />
              <a
                href={RESTAURANT_INFO.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-amber-400 transition-colors"
              >
                Sandh Restaurant · Karachi
              </a>
            </div>

            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex items-center gap-1 text-white hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="font-mono text-xs font-semibold">{RESTAURANT_INFO.displayPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <a href="#home" className="flex items-center gap-3 shrink-0 group">
          <img
            src={RESTAURANT_INFO.logoUrl}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/src/assets/images/al_jannat_logo.jpg';
            }}
            alt="Sandh Restaurant"
            referrerPolicy="no-referrer"
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg border border-amber-500/40 group-hover:scale-105 transition-transform bg-[#14161f]"
          />
          <div>
            <span className="font-serif text-lg sm:text-2xl font-black tracking-tight text-white block leading-none">
              SANDH
            </span>
            <span className="text-[10px] text-amber-400 tracking-wider uppercase font-semibold">
              Restaurant
            </span>
          </div>
        </a>

        {/* Center: Floating White Capsule Pill Nav (Exact Style from Image 2!) */}
        <nav className="hidden lg:flex items-center bg-white text-gray-950 rounded-full px-2 py-1.5 shadow-xl border border-white/20">
          <a
            href="#home"
            onClick={() => setActiveNav('home')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'home'
                ? 'bg-[#d8c7ff] text-[#2a1163] shadow-xs'
                : 'text-gray-700 hover:text-black hover:bg-gray-100'
            }`}
          >
            Home
          </a>
          <a
            href="#menu"
            onClick={() => setActiveNav('menu')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'menu'
                ? 'bg-[#d8c7ff] text-[#2a1163] shadow-xs'
                : 'text-gray-700 hover:text-black hover:bg-gray-100'
            }`}
          >
            Menu
          </a>
          <a
            href="#deals"
            onClick={() => setActiveNav('deals')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'deals'
                ? 'bg-[#d8c7ff] text-[#2a1163] shadow-xs'
                : 'text-gray-700 hover:text-black hover:bg-gray-100'
            }`}
          >
            Deals
          </a>
          <button
            type="button"
            onClick={() => {
              setActiveNav('book-table');
              setIsTableReservationModalOpen(true);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'book-table'
                ? 'bg-[#d8c7ff] text-[#2a1163] shadow-xs'
                : 'text-gray-700 hover:text-black hover:bg-gray-100'
            }`}
          >
            Table Reservation
          </button>
          <a
            href="#reviews"
            onClick={() => setActiveNav('reviews')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'reviews'
                ? 'bg-[#d8c7ff] text-[#2a1163] shadow-xs'
                : 'text-gray-700 hover:text-black hover:bg-gray-100'
            }`}
          >
            Reviews
          </a>
          <a
            href="#contact"
            onClick={() => setActiveNav('contact')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeNav === 'contact'
                ? 'bg-[#d8c7ff] text-[#2a1163] shadow-xs'
                : 'text-gray-700 hover:text-black hover:bg-gray-100'
            }`}
          >
            Contact
          </a>

          {/* Search Trigger */}
          <a
            href="#menu"
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 transition-colors ml-1"
            title="Search Menu"
          >
            <Search className="w-4 h-4" />
          </a>
        </nav>

        {/* Right Nav Actions (Compact Notification Button + White Circular Cart + User Pill) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Compact Notification Button with Red Count Badge */}
          <button
            type="button"
            onClick={() => setIsUpdatesModalOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#151822] hover:bg-[#1e2230] border border-white/15 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all relative cursor-pointer"
            title="Notifications & Updates"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {posts.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0a0b0f] shadow-sm">
                {posts.length}
              </span>
            )}
          </button>

          {/* White Circular Cart Button (Exact Style from Image 2!) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full text-gray-950 flex items-center justify-center shadow-lg transition-all relative cursor-pointer ${
              cartBump
                ? 'bg-amber-400 scale-110 ring-4 ring-amber-400/50 animate-cart-bounce'
                : 'bg-white hover:bg-gray-100 hover:scale-105 active:scale-95'
            }`}
            title="Open Cart"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className={`w-5 h-5 ${cartBump ? 'text-gray-950 stroke-[2.5]' : 'text-gray-950'}`} />
            {cartItemCount > 0 && (
              <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-white font-mono text-[10px] font-black flex items-center justify-center ring-2 ring-[#0a0b0f] shadow-md ${
                cartBump ? 'bg-black animate-bounce' : 'bg-[#7c3aed] animate-pulse'
              }`}>
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User / Orders Capsule Pill (Exact Style from Image 2!) */}
          <button
            onClick={() => setIsOrdersOpen(true)}
            className="hidden sm:flex items-center gap-2 h-10 sm:h-11 px-3.5 rounded-full bg-white hover:bg-gray-100 text-gray-950 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="My Orders & Profile"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-gray-950 font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-gray-900">
              Orders
            </span>
            {orders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />
            )}
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white bg-[#151822] border border-[#272e40] transition-colors cursor-pointer"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1017] border-b border-[#202534] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[#161924] hover:bg-[#1f2433] text-white text-center font-bold"
            >
              Home
            </a>
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[#161924] hover:bg-[#1f2433] text-white text-center font-bold"
            >
              Menu
            </a>
            <a
              href="#deals"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[#161924] hover:bg-[#1f2433] text-white text-center font-bold"
            >
              Deals
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsTableReservationModalOpen(true);
              }}
              className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-center font-bold cursor-pointer"
            >
              Table Reservation
            </button>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[#161924] hover:bg-[#1f2433] text-white text-center font-bold"
            >
              Reviews
            </a>
          </div>

          <div className="pt-2 border-t border-[#1e2330] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsOrdersOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs bg-[#161924] text-white rounded-xl border border-[#272d3e] cursor-pointer"
            >
              <span className="flex items-center gap-2 font-bold">
                <Clock className="w-4 h-4 text-amber-400" />
                My Orders
              </span>
              <span className="text-amber-400 font-mono font-bold">{orders.length}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsBookingsOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs bg-[#161924] text-white rounded-xl border border-[#272d3e] cursor-pointer"
            >
              <span className="flex items-center gap-2 font-bold">
                <Calendar className="w-4 h-4 text-amber-400" />
                My Saved Bookings
              </span>
              <span className="text-amber-400 font-mono font-bold">{bookings.length}</span>
            </button>

            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="w-full flex items-center justify-center gap-2 px-3 py-3 text-xs font-bold bg-white text-gray-950 rounded-xl shadow-lg hover:bg-gray-100"
            >
              <Phone className="w-4 h-4" />
              Call {RESTAURANT_INFO.displayPhone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
