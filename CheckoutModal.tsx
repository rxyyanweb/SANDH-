import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  X,
  MapPin,
  Navigation,
  Bike,
  ShoppingBag,
  Utensils,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Check,
  RotateCw,
  Phone,
  Info,
  Home,
  Briefcase,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { DELIVERY_AREAS, RESTAURANT_INFO } from '../data/restaurantData';
import { isValidPakistaniPhone } from '../utils/validation';
import { getReservationSlotsForDate } from '../utils/hours';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    cart,
    orderType,
    setOrderType,
    selectedAreaId,
    setSelectedAreaId,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    customerInfo,
    placeOrder,
  } = useRestaurant();

  // Today's date string YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [fullName, setFullName] = useState(customerInfo.name || '');
  const [phoneNumber, setPhoneNumber] = useState(customerInfo.phone || '');

  // Delivery Location Mode: 'auto' | 'manual'
  const [deliveryMode, setDeliveryMode] = useState<'auto' | 'manual'>('auto');
  const [address, setAddress] = useState(customerInfo.address || '');
  const [instructions, setInstructions] = useState(customerInfo.instructions || '');
  const [locating, setLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState('');

  // Structured Manual Address Fields (like standard delivery apps)
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Work' | 'Apartment' | 'Other'>('Home');
  const [manualHouseFlat, setManualHouseFlat] = useState('');
  const [manualStreetBlock, setManualStreetBlock] = useState('');
  const [manualAreaRoad, setManualAreaRoad] = useState('');
  const [manualLandmark, setManualLandmark] = useState('');
  const [manualCity, setManualCity] = useState('Karachi');

  // User GPS Coordinates for Live Map Pin (default Karachi Clifton / Gulshan)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Dine-in / Table Booking options
  const [bookingDate, setBookingDate] = useState<string>(todayStr);
  const availableSlots = useMemo(() => getReservationSlotsForDate(bookingDate), [bookingDate]);
  const [bookingTime, setBookingTime] = useState<string>(() => availableSlots[3] || '7:30 PM');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [seatingPref, setSeatingPref] = useState<string>('Outdoor preferred');

  const [confirmedDetails, setConfirmedDetails] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedArea = DELIVERY_AREAS.find((a) => a.id === selectedAreaId) || DELIVERY_AREAS[0];

  // If address has previous data when customer opens modal
  useEffect(() => {
    if (customerInfo.address && !address) {
      setAddress(customerInfo.address);
    }
  }, [customerInfo.address]);

  // Automatically compose manual address from structured fields when in manual mode
  const composedManualAddress = useMemo(() => {
    const parts = [
      manualHouseFlat.trim(),
      manualStreetBlock.trim(),
      manualAreaRoad.trim() || selectedArea.name,
      manualLandmark.trim() ? `Near ${manualLandmark.trim()}` : '',
      manualCity.trim() || 'Karachi',
    ].filter(Boolean);

    if (!manualHouseFlat.trim() && !manualStreetBlock.trim() && !manualAreaRoad.trim() && !manualLandmark.trim()) {
      return '';
    }
    return `[${addressLabel}] ${parts.join(', ')}`;
  }, [addressLabel, manualHouseFlat, manualStreetBlock, manualAreaRoad, manualLandmark, manualCity, selectedArea.name]);

  // Auto-Detect customer GPS, reverse geocode and show on map
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser. Please switch to Manual Address.');
      return;
    }

    setLocating(true);
    setErrorMessage('');
    setLocationSuccess('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        // Reverse geocoding via OpenStreetMap Nominatim
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: { 'Accept-Language': 'en' },
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const street = addr.road || addr.street || addr.neighbourhood || addr.suburb || '';
            const block = addr.suburb || addr.quarter || addr.city_district || '';
            const city = addr.city || addr.town || 'Karachi';

            const parts = [street, block, city].filter((p, i, arr) => p && arr.indexOf(p) === i);
            const formatted =
              parts.length > 0
                ? parts.join(', ')
                : `Current GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Karachi`;

            setAddress(formatted);
            setLocationSuccess(formatted);
          } else {
            throw new Error('Reverse geocode failed');
          }
        } catch {
          const fallback = `Pinned GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) - Karachi`;
          setAddress(fallback);
          setLocationSuccess(fallback);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage('Location permission was denied. Please allow location access or click "Enter Manually".');
        } else {
          setErrorMessage('Could not detect GPS automatically. Please try again or use "Enter Manually".');
        }
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  // Trigger auto location when switching to 'auto' if not detected yet
  useEffect(() => {
    if (isCheckoutOpen && orderType === 'delivery' && deliveryMode === 'auto' && !coords && !locating) {
      handleGetCurrentLocation();
    }
  }, [isCheckoutOpen, orderType, deliveryMode]);

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your Pakistani mobile number.');
      return;
    }

    if (!isValidPakistaniPhone(phoneNumber.trim())) {
      setErrorMessage('Invalid phone number. Please enter a valid 11-digit Pakistani mobile number (e.g. 03354526628).');
      return;
    }

    let finalDeliveryAddress = address.trim();

    if (orderType === 'delivery') {
      if (deliveryMode === 'manual') {
        if (!manualHouseFlat.trim() || !manualStreetBlock.trim()) {
          setErrorMessage('Please enter your House/Flat No. and Street/Block details in the manual address fields.');
          return;
        }
        finalDeliveryAddress = composedManualAddress;
      } else {
        if (!finalDeliveryAddress) {
          setErrorMessage('Please detect your GPS location on the map or switch to Enter Manually.');
          return;
        }
      }
    }

    if (orderType === 'dinein') {
      if (!bookingTime) {
        setErrorMessage('Please select a valid arrival time during restaurant opening hours.');
        return;
      }
    }

    if (!confirmedDetails) {
      setErrorMessage('Please check the confirmation box to verify your order details.');
      return;
    }

    placeOrder({
      customerName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      deliveryAddress: orderType === 'delivery' ? finalDeliveryAddress : undefined,
      deliveryInstructions:
        orderType === 'delivery'
          ? instructions.trim() || undefined
          : orderType === 'dinein'
            ? `${seatingPref}`
            : undefined,
      bookingDate: orderType === 'dinein' ? bookingDate : undefined,
      bookingTime: orderType === 'dinein' ? bookingTime : undefined,
      guestsCount: orderType === 'dinein' ? guestsCount : undefined,
    });

    setIsCheckoutOpen(false);
  };

  // Map coordinates (use detected coords or default to Clifton / Karachi)
  const mapLat = coords ? coords.lat : 24.8138;
  const mapLng = coords ? coords.lng : 67.0303;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCheckoutOpen(false);
      }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overscroll-contain animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-[460px] max-h-[92dvh] flex flex-col bg-[#0b0b0c] text-white border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto animate-modal-pop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        {/* Top Header (Matching Screenshot Theme) */}
        <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-white/[0.07] bg-[#0b0b0c] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setIsCartOpen(true);
                }}
                className="p-1 -ml-1 text-white hover:text-[#f5c518] transition-colors cursor-pointer"
                aria-label="Back to cart"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
              </button>
              <h2 id="checkout-title" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Finalize Your Order
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-1 pl-0.5">
            Review your details to receive order confirmation • demo notice
          </p>
        </div>

        {/* Scrollable Body (Matching Screenshot Dark Cards Theme) */}
        <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 text-gray-200">
          {/* 1. DEMO NOTICE CARD */}
          <div className="bg-[#141416] border border-white/[0.07] rounded-2xl p-3.5 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
              DEMO NOTICE
            </span>
            <div className="bg-[#f0d475] text-[#1c1708] rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-inner">
              <p className="text-xs font-semibold leading-snug">
                Demo Notice: This is a demo order — no real charge will be processed
              </p>
              <Info className="w-4 h-4 text-[#3b3110] shrink-0" />
            </div>
          </div>

          {/* 2. CHOOSE ORDER TYPE CARD */}
          <div className="bg-[#141416] border border-white/[0.07] rounded-2xl p-3.5 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
              CHOOSE ORDER TYPE
            </span>

            <div className="space-y-2">
              {/* Option 1: Delivery To Doorstep */}
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`w-full px-3.5 py-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'border-[#d4af37] bg-[#1b1912] text-white shadow-md'
                    : 'border-white/10 bg-[#19191c] text-gray-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bike
                    className={`w-5 h-5 shrink-0 ${
                      orderType === 'delivery' ? 'text-[#f5c518]' : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm font-bold text-white">Delivery To Doorstep</span>
                </div>

                {orderType === 'delivery' ? (
                  <span className="w-5 h-5 rounded-full bg-[#22c55e] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-gray-500 shrink-0" />
                )}
              </button>

              {/* Option 2: Takeaway Pick at Counter */}
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`w-full px-3.5 py-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  orderType === 'pickup'
                    ? 'border-[#d4af37] bg-[#1b1912] text-white shadow-md'
                    : 'border-white/10 bg-[#19191c] text-gray-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag
                    className={`w-5 h-5 shrink-0 ${
                      orderType === 'pickup' ? 'text-[#f5c518]' : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm font-bold text-white">Takeaway Pick at Counter</span>
                </div>

                {orderType === 'pickup' ? (
                  <span className="w-5 h-5 rounded-full bg-[#22c55e] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-gray-500 shrink-0" />
                )}
              </button>

              {/* Option 3: Book Table / Dine-in Order */}
              <button
                type="button"
                onClick={() => setOrderType('dinein')}
                className={`w-full px-3.5 py-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  orderType === 'dinein'
                    ? 'border-[#d4af37] bg-[#1b1912] text-white shadow-md'
                    : 'border-white/10 bg-[#19191c] text-gray-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Utensils
                    className={`w-5 h-5 shrink-0 ${
                      orderType === 'dinein' ? 'text-[#f5c518]' : 'text-gray-400'
                    }`}
                  />
                  <div className="leading-tight">
                    <span className="text-sm font-bold text-white block">Book Table</span>
                    <span className="text-xs font-bold text-gray-200 block">Dine-in Order</span>
                  </div>
                </div>

                {orderType === 'dinein' ? (
                  <span className="w-5 h-5 rounded-full bg-[#22c55e] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-gray-500 shrink-0" />
                )}
              </button>
            </div>

            {/* Selected Status Line */}
            <p className="text-xs font-bold text-[#f5c518] pt-0.5">
              {orderType === 'delivery'
                ? `Selected • Estimated delivery: ${selectedArea.estimatedTime}`
                : orderType === 'pickup'
                  ? 'Selected • Estimated prep: 20-30 min'
                  : 'Selected • Estimated prep: 25-35 min'}
            </p>
          </div>

          {/* 3. CUSTOMER CONTACT CARD */}
          <div className="bg-[#141416] border border-white/[0.07] rounded-2xl p-3.5 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
              CUSTOMER CONTACT
            </span>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-sm font-bold text-white placeholder-gray-500 focus:outline-none focus:border-[#f5c518] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Pakistani Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="03354526628"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-sm font-bold text-white placeholder-gray-500 focus:outline-none focus:border-[#f5c518] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 4A. DELIVERY DETAILS: AUTO (WITH LIVE MAP) vs MANUAL (NO MAP, FULL CATEGORIZED FIELDS) */}
          {orderType === 'delivery' && (
            <div className="bg-[#141416] border border-white/[0.07] rounded-2xl p-3.5 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                  DELIVERY LOCATION &amp; ADDRESS
                </span>
                <span className="text-[11px] text-[#f5c518] font-bold">
                  Fee: Rs. {selectedArea.fee}
                </span>
              </div>

              {/* Delivery Mode Toggle: Auto Location (Map) vs Manual Address */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#0e0e10] border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMode('auto');
                    handleGetCurrentLocation();
                  }}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    deliveryMode === 'auto'
                      ? 'bg-[#f5c518] text-black shadow-md'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                  <span>{locating ? 'Detecting...' : 'Auto Location (GPS)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMode('manual');
                    setErrorMessage('');
                  }}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    deliveryMode === 'manual'
                      ? 'bg-[#f5c518] text-black shadow-md'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Manual Address</span>
                </button>
              </div>

              {/* =========================================================
                  MODE 1: AUTO LOCATION (MAP + GPS CURRENT LOCATION)
                  ========================================================= */}
              {deliveryMode === 'auto' && (
                <div className="space-y-3">
                  {locationSuccess && (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="leading-snug">
                        <span className="font-bold block text-emerald-200">Current Location Pinned from Map:</span>
                        <span className="text-gray-200 text-xs">{locationSuccess}</span>
                      </div>
                    </div>
                  )}

                  {/* Live Map Display (ONLY shown in Auto mode) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="font-semibold text-gray-200 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#f5c518]" />
                        <span>Live Map Current Location</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="text-[11px] text-[#f5c518] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        <RotateCw className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
                        <span>Detect Current GPS</span>
                      </button>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0b0b0c]">
                      <iframe
                        title="Customer Location Map"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.006}%2C${mapLat - 0.005}%2C${mapLng + 0.006}%2C${mapLat + 0.005}&layer=mapnik&marker=${mapLat}%2C${mapLng}`}
                        className="w-full h-44 border-0"
                        loading="lazy"
                      />

                      <div className="bg-[#1b1b1e] px-3 py-2 flex items-center justify-between text-xs border-t border-white/10">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span className="text-white font-medium truncate">
                            {address ? address : 'Detecting current location on map...'}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[#f5c518] shrink-0">
                          {mapLat.toFixed(4)}, {mapLng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Area selector */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Delivery Area / Zone
                    </label>
                    <select
                      value={selectedAreaId}
                      onChange={(e) => setSelectedAreaId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#f5c518] cursor-pointer"
                    >
                      {DELIVERY_AREAS.map((area) => (
                        <option key={area.id} value={area.id} className="bg-[#141416] text-white">
                          {area.name} — Fee: Rs. {area.fee} ({area.estimatedTime})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Detected Address Field (Editable for House/Flat specifics) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Detected Map Address (You can add House/Flat #)
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Click Detect Current GPS or type House/Street details"
                      className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-[#f5c518]"
                    />
                  </div>

                  {/* Rider instructions */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Rider Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Call upon arrival, near security gate"
                      className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f5c518]"
                    />
                  </div>
                </div>
              )}

              {/* =========================================================
                  MODE 2: MANUAL ADDRESS (NO MAP — STRUCTURED CATEGORIES)
                  ========================================================= */}
              {deliveryMode === 'manual' && (
                <div className="space-y-3 pt-1">
                  {/* Category 1: Address Label (Home / Work / Apartment / Other) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Address Category / Label
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(
                        [
                          { id: 'Home', icon: Home },
                          { id: 'Work', icon: Briefcase },
                          { id: 'Apartment', icon: Building2 },
                          { id: 'Other', icon: MapPin },
                        ] as const
                      ).map((item) => {
                        const IconComp = item.icon;
                        const active = addressLabel === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setAddressLabel(item.id)}
                            className={`py-2 px-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              active
                                ? 'border-[#d4af37] bg-[#1b1912] text-[#f5c518]'
                                : 'border-white/10 bg-[#1b1b1e] text-gray-400 hover:text-white'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5 shrink-0" />
                            <span>{item.id}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category 2: Delivery Zone / Area */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Select Delivery Zone / Area <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={selectedAreaId}
                      onChange={(e) => setSelectedAreaId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#f5c518] cursor-pointer"
                    >
                      {DELIVERY_AREAS.map((area) => (
                        <option key={area.id} value={area.id} className="bg-[#141416] text-white">
                          {area.name} — Fee: Rs. {area.fee} ({area.estimatedTime})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category 3 & 4: House/Flat/Floor & Street/Block */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        House / Flat / Floor No. <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={manualHouseFlat}
                        onChange={(e) => setManualHouseFlat(e.target.value)}
                        placeholder="e.g. House #14 / Flat 4B, 4th Floor"
                        className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-[#f5c518]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Street / Lane / Block / Phase <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={manualStreetBlock}
                        onChange={(e) => setManualStreetBlock(e.target.value)}
                        placeholder="e.g. Street 6, Block 9 Clifton"
                        className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-[#f5c518]"
                      />
                    </div>
                  </div>

                  {/* Category 5 & 6: Society/Road & Nearest Landmark */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Sector / Society / Main Road
                      </label>
                      <input
                        type="text"
                        value={manualAreaRoad}
                        onChange={(e) => setManualAreaRoad(e.target.value)}
                        placeholder="e.g. Khayaban-e-Iqbal / KDA"
                        className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-[#f5c518]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Nearest Famous Landmark
                      </label>
                      <input
                        type="text"
                        value={manualLandmark}
                        onChange={(e) => setManualLandmark(e.target.value)}
                        placeholder="e.g. Near Ocean Towers / Masjid"
                        className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-[#f5c518]"
                      />
                    </div>
                  </div>

                  {/* Category 7: City & Rider Instructions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={manualCity}
                        onChange={(e) => setManualCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#f5c518]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Delivery / Rider Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="e.g. Ring bell twice, call at gate"
                        className="w-full px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f5c518]"
                      />
                    </div>
                  </div>

                  {/* Formatted Manual Address Preview */}
                  {composedManualAddress && (
                    <div className="p-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl text-[11px] text-gray-300">
                      <span className="text-[#f5c518] font-bold block mb-0.5">Complete Delivery Address:</span>
                      <span>{composedManualAddress}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4B. TAKEAWAY PICKUP DETAILS WITH OCEAN TOWERS BRANCH LOCATION */}
          {orderType === 'pickup' && (
            <div className="bg-[#141416] border border-white/[0.07] rounded-2xl p-3.5 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
                TAKEAWAY PICKUP &amp; BRANCH LOCATION
              </span>

              <div className="p-3.5 bg-[#1b1b1e] border border-white/10 rounded-xl space-y-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#f5c518] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white block">
                      Sandh Restaurant — Pickup Branch Address
                    </span>
                    <p className="text-xs text-gray-200 font-medium leading-relaxed">
                      Allamah Basheer Ahmed Usmani Rd, Ayaz Town Shop #3, A 286، near Mochi More, Block 2 Gulshan-e-Iqbal, Karachi, Pakistan
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-white/10 text-[11px]">
                  <span className="text-[#f5c518] font-semibold">
                    Prep Time: 20–30 mins (No Delivery Fee)
                  </span>
                  <a
                    href={RESTAURANT_INFO.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white hover:text-[#f5c518] font-bold transition-colors"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 4C. DINE-IN ARRIVAL & TABLE DETAILS (MATCHING SCREENSHOT) */}
          {orderType === 'dinein' && (
            <div className="bg-[#141416] border border-white/[0.07] rounded-2xl p-3.5 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
                DINE-IN ARRIVAL &amp; TABLE DETAILS
              </span>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Arrival Time
                </label>
                <div className="px-3.5 py-2.5 bg-[#1b1b1e] border border-white/10 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>Open: 12 PM–12 AM</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#f5c518]">{bookingTime}</span>
                </div>
              </div>

              {/* Date, Time & Guests Selectors */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">
                    Select Slot
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#f5c518] cursor-pointer"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot} className="bg-[#141416] text-white">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">
                    Guests
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-[#1b1b1e] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#f5c518] cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                      <option key={num} value={num} className="bg-[#141416] text-white">
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seating Preference & Table Details */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-400">
                    Table Details
                  </label>
                  <div className="flex items-center gap-1">
                    {['Outdoor preferred', 'Indoor AC Hall', 'Family Area'].map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setSeatingPref(pref)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                          seatingPref === pref
                            ? 'bg-[#f5c518]/20 text-[#f5c518] border border-[#f5c518]/40'
                            : 'bg-[#1b1b1e] text-gray-400 hover:text-white'
                        }`}
                      >
                        {pref.replace(' preferred', '')}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-300">
                  Table will be reserved for {guestsCount} {guestsCount === 1 ? 'guest' : 'guests'} • {seatingPref}
                </p>
              </div>
            </div>
          )}

          {/* 5. ORDER SUMMARY & PAYMENT DETAILS CARD (Preserving all existing checkout info) */}
          <div className="bg-[#141416] border border-white/[0.07] rounded-2xl p-3.5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.07]">
              <span className="text-gray-400">Payment Method</span>
              <span className="font-bold text-white">
                {orderType === 'delivery'
                  ? 'Cash on Delivery (Pay at Doorstep)'
                  : orderType === 'pickup'
                    ? 'Payment at Pickup Counter'
                    : 'Payment at Restaurant (Post Dining)'}
              </span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Items Total ({cart.length} dishes)</span>
              <span className="font-mono font-semibold text-white">
                Rs. {cartSubtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Delivery Fee</span>
              <span className="font-mono font-semibold text-white">
                {orderType === 'delivery' ? `Rs. ${deliveryFee}` : 'Free (Rs. 0)'}
              </span>
            </div>

            <div className="pt-2 border-t border-white/[0.07] flex justify-between items-center text-sm font-extrabold text-white">
              <span>Grand Total</span>
              <span className="font-mono text-[#f5c518] text-base">
                Rs. {cartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/50 border border-rose-700/60 rounded-xl text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-gray-400 cursor-pointer px-1">
            <input
              type="checkbox"
              checked={confirmedDetails}
              onChange={(e) => setConfirmedDetails(e.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-[#141416] text-[#f5c518] focus:ring-[#f5c518] w-4 h-4 cursor-pointer"
            />
            <span>
              I confirm that my contact and order specifications are accurate for this demonstration order.
            </span>
          </label>
        </form>

        {/* Fixed Sticky Bottom Footer (Exact Match to Screenshot, Responsive & Order-Type Dynamic) */}
        <div className="p-2.5 sm:p-4 bg-[#0b0b0c] border-t border-white/10 shrink-0 flex items-center justify-between gap-2">
          {/* Left: TO PAY Box */}
          <div className="bg-[#141416] border border-white/[0.07] rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 shrink-0">
            <span className="block text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
              TO PAY
            </span>
            <span className="text-sm sm:text-lg font-extrabold text-white leading-tight block whitespace-nowrap">
              Rs. {cartTotal.toLocaleString()}
            </span>
          </div>

          {/* Right: Cancel + Dynamic Order Type Confirm Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 justify-end">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white bg-[#141416] hover:bg-[#1e1e22] rounded-xl border border-white/15 transition-colors cursor-pointer shrink-0"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="flex-1 min-w-0 px-3 sm:px-5 py-2.5 sm:py-3 bg-[#f5c518] hover:bg-[#eab308] active:scale-[0.99] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap truncate text-center"
            >
              {orderType === 'delivery'
                ? 'Confirm Delivery'
                : orderType === 'pickup'
                  ? 'Confirm Takeaway'
                  : 'Book Table & Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
