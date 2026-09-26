import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ShieldCheck,
  UtensilsCrossed,
  Lock,
  X,
  ChevronDown,
  Users,
  Plus,
  Minus,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { getReservationSlotsForDate } from '../utils/hours';
import { RESTAURANT_INFO } from '../data/restaurantData';
import {
  BookingOccasion,
  SeatingPreference,
  TableBooking,
  TableSeatAllocation,
} from '../types/restaurant';
import { isValidPakistaniPhone } from '../utils/validation';

const SEATING_OPTIONS: { id: SeatingPreference; label: string; icon: string }[] = [
  { id: 'Indoor', label: 'Indoor', icon: '🪑' },
  { id: 'Outdoor', label: 'Outdoor', icon: '🌿' },
  { id: 'Rooftop', label: 'Rooftop', icon: '🌃' },
  { id: 'Family Hall', label: 'Family Hall', icon: '👨‍👩‍👧‍👦' },
];

const OCCASION_OPTIONS: Exclude<BookingOccasion, ''>[] = [
  'Birthday',
  'Anniversary',
  'Business Meeting',
  'Casual',
];

function buildDefaultAllocations(totalGuests: number, tables: number): TableSeatAllocation[] {
  const safeTables = Math.max(1, tables);
  const safeGuests = Math.max(safeTables, totalGuests);
  const basePerTable = Math.floor(safeGuests / safeTables);
  const remainder = safeGuests % safeTables;

  return Array.from({ length: safeTables }, (_, idx) => ({
    tableNumber: idx + 1,
    guests: basePerTable + (idx < remainder ? 1 : 0),
  }));
}

export const TableReservationFormCard: React.FC<{
  onCloseModal?: () => void;
}> = ({ onCloseModal }) => {
  const { createBooking, customerInfo } = useRestaurant();

  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [date, setDate] = useState<string>(todayStr);
  const [availableSlots, setAvailableSlots] = useState<string[]>(() =>
    getReservationSlotsForDate(todayStr)
  );
  const [arrivalTime, setArrivalTime] = useState<string>('7:30 PM');
  const [guests, setGuests] = useState<number>(6);
  const [customGuestsInput, setCustomGuestsInput] = useState<string>('6');
  const [tableCount, setTableCount] = useState<number>(1);
  const [tableAllocations, setTableAllocations] = useState<TableSeatAllocation[]>(() =>
    buildDefaultAllocations(6, 1)
  );
  const [seatingPreference, setSeatingPreference] = useState<SeatingPreference>('Indoor');
  const [occasion, setOccasion] = useState<BookingOccasion>('Casual');
  const [name, setName] = useState<string>(customerInfo.name || '');
  const [phone, setPhone] = useState<string>(customerInfo.phone || '');
  const [specialRequest, setSpecialRequest] = useState<string>('');
  const [recentBooking, setRecentBooking] = useState<TableBooking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const slots = getReservationSlotsForDate(newDate);
    setAvailableSlots(slots);
    if (!slots.includes(arrivalTime)) {
      setArrivalTime(slots[5] || '7:30 PM');
    }
  };

  const handleQuickToday = () => {
    handleDateChange(todayStr);
  };

  const handleTotalGuestsChange = (newTotal: number) => {
    const clamped = Math.max(1, Math.min(200, newTotal));
    setGuests(clamped);
    setCustomGuestsInput(String(clamped));
    const adjustedTables = Math.min(tableCount, clamped);
    setTableCount(adjustedTables);
    setTableAllocations(buildDefaultAllocations(clamped, adjustedTables));
  };

  const handleCustomGuestsInputChange = (val: string) => {
    setCustomGuestsInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      const clamped = Math.min(200, parsed);
      setGuests(clamped);
      const adjustedTables = Math.min(tableCount, clamped);
      setTableCount(adjustedTables);
      setTableAllocations(buildDefaultAllocations(clamped, adjustedTables));
    }
  };

  const handleTableCountChange = (newTableCount: number) => {
    const safeTables = Math.max(1, Math.min(20, newTableCount));
    const updatedGuests = Math.max(guests, safeTables);
    if (updatedGuests !== guests) {
      setGuests(updatedGuests);
      setCustomGuestsInput(String(updatedGuests));
    }
    setTableCount(safeTables);
    setTableAllocations(buildDefaultAllocations(updatedGuests, safeTables));
  };

  const handleSingleTableGuestChange = (tableNumber: number, newTableGuests: number) => {
    const safeVal = Math.max(1, Math.min(100, newTableGuests));
    const updated = tableAllocations.map((t) =>
      t.tableNumber === tableNumber ? { ...t, guests: safeVal } : t
    );
    setTableAllocations(updated);
    const sumGuests = updated.reduce((sum, item) => sum + item.guests, 0);
    setGuests(sumGuests);
    setCustomGuestsInput(String(sumGuests));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }
    if (!isValidPakistaniPhone(phone.trim())) {
      setErrorMessage('Please enter a valid 11-digit Pakistani mobile number (e.g. 03354526628).');
      return;
    }
    if (!arrivalTime) {
      setErrorMessage('Please select an arrival time.');
      return;
    }

    const booking = createBooking({
      customerName: name.trim(),
      phoneNumber: phone.trim(),
      date,
      arrivalTime,
      guests,
      tableCount,
      tableAllocations,
      seatingPreference,
      occasion,
      specialRequest: specialRequest.trim() || undefined,
    });

    setRecentBooking(booking);
  };

  if (recentBooking) {
    return (
      <div className="relative bg-gradient-to-b from-[#23201b]/95 via-[#171614]/95 to-[#11110f]/95 backdrop-blur-2xl border border-[#d4af37]/50 rounded-[28px] p-6 sm:p-8 space-y-5 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(212,175,55,0.15)] text-white">
        {onCloseModal && (
          <button
            type="button"
            onClick={onCloseModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close reservation modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#e5c158] font-bold block">
              Reservation Confirmed Instantly
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              Booking #{recentBooking.bookingNumber}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 bg-[#1c1b18] rounded-xl border border-[#d4af37]/25">
            <span className="text-[10px] text-gray-400 block font-medium">Guest Name</span>
            <span className="font-bold text-white truncate block mt-0.5">
              {recentBooking.customerName}
            </span>
          </div>
          <div className="p-3 bg-[#1c1b18] rounded-xl border border-[#d4af37]/25">
            <span className="text-[10px] text-gray-400 block font-medium">Date &amp; Time</span>
            <span className="font-bold text-[#f3ca52] block mt-0.5">
              {recentBooking.date} · {recentBooking.arrivalTime}
            </span>
          </div>
          <div className="p-3 bg-[#1c1b18] rounded-xl border border-[#d4af37]/25 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-gray-400 block font-medium">Guests &amp; Tables</span>
            <span className="font-bold text-white block mt-0.5">
              {recentBooking.guests} Members · {recentBooking.tableCount || 1}{' '}
              {(recentBooking.tableCount || 1) === 1 ? 'Table' : 'Tables'}
            </span>
          </div>
        </div>

        {/* Per-Table Guest Breakdown */}
        {recentBooking.tableAllocations && recentBooking.tableAllocations.length > 0 && (
          <div className="p-3.5 bg-[#1c1b18] rounded-xl border border-[#d4af37]/25 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                Table Seating Breakdown ({recentBooking.seatingPreference || 'Indoor'})
              </span>
              {recentBooking.occasion && (
                <span className="text-[#f3ca52] font-bold text-[11px]">
                  {recentBooking.occasion}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {recentBooking.tableAllocations.map((alloc) => (
                <span
                  key={alloc.tableNumber}
                  className="px-3 py-1 rounded-lg bg-[#12110f] border border-[#d4af37]/40 text-xs font-bold text-[#f5e6c8]"
                >
                  Table {alloc.tableNumber}: {alloc.guests}{' '}
                  {alloc.guests === 1 ? 'Member' : 'Members'}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 leading-relaxed">
          Your table reservation at <strong>{RESTAURANT_INFO.name}</strong> has been confirmed. We
          look forward to welcoming you!
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={() => setRecentBooking(null)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#d4af37] via-[#f3d066] to-[#c59b27] hover:brightness-105 active:scale-95 text-gray-950 font-black text-xs sm:text-sm rounded-2xl transition-all text-center cursor-pointer shadow-lg"
          >
            Book Another Table
          </button>
          <a
            href={`tel:${RESTAURANT_INFO.phone}`}
            className="w-full py-3.5 px-4 bg-[#1c1b18] hover:bg-[#262420] text-white font-bold text-xs sm:text-sm rounded-2xl border border-[#d4af37]/35 transition-colors text-center"
          >
            Call {RESTAURANT_INFO.displayPhone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={handleBookingSubmit}
        className="relative bg-gradient-to-b from-[#25211c]/95 via-[#181714]/95 to-[#12110f]/95 backdrop-blur-2xl border border-[#d4af37]/45 rounded-[28px] p-5 sm:p-8 space-y-5 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(212,175,55,0.12)] text-white overflow-hidden"
      >
        {/* Top metallic gold rim shimmer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#fce38a] to-transparent opacity-80" />

        {onCloseModal && (
          <button
            type="button"
            onClick={onCloseModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Close table reservation"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Title & Book for Today Row */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between gap-2 ${onCloseModal ? 'pr-10' : ''}`}>
            <div className="min-w-0">
              <h3 className="text-2xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-[#f7df8b] via-[#e2c05c] to-[#c69d2e] bg-clip-text text-transparent tracking-tight leading-tight">
                Table Reservation
              </h3>
              <div className="h-[1px] w-40 sm:w-64 bg-gradient-to-r from-[#d4af37]/70 via-[#fce38a] to-transparent mt-2" />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleQuickToday}
              className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-[#f5e6c8] bg-[#1e1c17]/90 hover:bg-[#d4af37]/20 border border-[#d4af37]/50 transition-all cursor-pointer shadow-sm whitespace-nowrap"
            >
              Book for Today
            </button>
          </div>
        </div>

        {/* Date Input */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-semibold text-[#f3ead8]">Date</label>
          <div className="relative w-full overflow-hidden rounded-2xl">
            <input
              type="date"
              required
              min={todayStr}
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full max-w-full min-w-0 block appearance-none px-3.5 sm:px-4 py-3 sm:py-3.5 bg-[#1c1b18]/90 border border-[#d4af37]/35 rounded-2xl text-sm sm:text-base text-white font-medium focus:outline-none focus:border-[#f3ca52] transition-colors box-border"
            />
          </div>
        </div>

        {/* Arrival Time Select (5:00 PM - 12:30 AM) */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-semibold text-[#f3ead8]">
            Arrival Time
          </label>
          <div className="relative">
            <select
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full appearance-none px-3.5 sm:px-4 py-3 sm:py-3.5 bg-[#1c1b18]/90 border border-[#d4af37]/35 rounded-2xl text-sm sm:text-base text-white font-medium focus:outline-none focus:border-[#f3ca52] cursor-pointer transition-colors"
            >
              {availableSlots.map((slot) => (
                <option key={slot} value={slot} className="bg-[#181714] text-white">
                  {slot}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-[#e5c158] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Number of Guests (Quick 1-8 Grid + Custom Members Input) */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-[#f3ead8] min-w-0">
              Number of Guests (Members)
            </label>
            <span className="text-xs font-bold text-[#f3ca52] shrink-0">
              Total: {guests} {guests === 1 ? 'Member' : 'Members'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
              const isSelected = guests === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleTotalGuestsChange(num)}
                  className={`h-11 sm:h-13 rounded-2xl font-bold text-base sm:text-lg transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#fde68a] via-[#e5c158] to-[#c59b27] text-gray-950 font-black shadow-[0_0_25px_rgba(229,193,88,0.6)] border border-[#fff6c2] scale-[1.03]'
                      : 'bg-[#1c1b18]/85 border border-[#d4af37]/30 text-white hover:border-[#d4af37]/65 hover:bg-[#25231e]'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Custom Members Input Box (Apni Marzi Se Members Likhain) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#1a1814]/95 border border-[#d4af37]/35">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Users className="w-4 h-4 text-[#e5c158] shrink-0" />
              <span className="text-[11px] sm:text-xs text-gray-300 font-medium leading-snug">
                Custom Members (Apni marzi se likhain):
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => handleTotalGuestsChange(guests - 1)}
                className="w-8 h-8 rounded-xl bg-[#25221c] hover:bg-[#302c24] border border-[#d4af37]/40 flex items-center justify-center text-white cursor-pointer active:scale-95"
                aria-label="Decrease members"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min={1}
                max={200}
                value={customGuestsInput}
                onChange={(e) => handleCustomGuestsInputChange(e.target.value)}
                onBlur={() => setCustomGuestsInput(String(guests))}
                placeholder="e.g. 12"
                className="w-14 sm:w-16 px-1.5 py-1.5 text-center bg-[#12110f] border border-[#d4af37]/50 rounded-xl text-xs sm:text-sm font-bold text-[#f3ca52] focus:outline-none focus:border-[#fce38a]"
              />
              <button
                type="button"
                onClick={() => handleTotalGuestsChange(guests + 1)}
                className="w-8 h-8 rounded-xl bg-[#25221c] hover:bg-[#302c24] border border-[#d4af37]/40 flex items-center justify-center text-white cursor-pointer active:scale-95"
                aria-label="Increase members"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* TABLE RESERVATION COUNT & PER-TABLE GUEST ALLOCATION (Kitni Table & Konsi Table Par Kitne Bande) */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <label className="text-xs sm:text-sm font-semibold text-[#f3ead8] min-w-0">
              How Many Tables? (Kitni Table Chahiye)
            </label>
            <span className="text-xs font-bold text-[#e5c158] shrink-0">
              {tableCount} {tableCount === 1 ? 'Table' : 'Tables'}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[1, 2, 3, 4].map((tNum) => {
              const active = tableCount === tNum;
              return (
                <button
                  key={tNum}
                  type="button"
                  onClick={() => handleTableCountChange(tNum)}
                  className={`py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-[#2b2413] border border-[#d4af37] text-[#f3ca52] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                      : 'bg-[#1c1b18] border border-white/10 text-gray-300 hover:border-[#d4af37]/40'
                  }`}
                >
                  {tNum} {tNum === 1 ? 'Table' : 'Tables'}
                </button>
              );
            })}

            {/* Custom Table Count Input */}
            <div className="relative flex items-center col-span-2 sm:col-span-1">
              <input
                type="number"
                min={1}
                max={20}
                value={tableCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1) {
                    handleTableCountChange(val);
                  }
                }}
                title="Custom number of tables"
                className="w-full py-2.5 px-2 text-center bg-[#141310] border border-[#d4af37]/45 rounded-xl text-xs font-bold text-[#f3ca52] focus:outline-none focus:border-[#fce38a]"
              />
            </div>
          </div>

          {/* Per-Table Guest Assignment (Konsi Table Par Kitne Bande) */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#181612]/95 border border-[#d4af37]/30 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#e5c158] min-w-0">
                Guests Per Table (Konsi Table Par Kitne Bande)
              </span>
              <span className="text-[11px] text-gray-400 shrink-0">
                Total: {guests} Members
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto pr-0.5">
              {tableAllocations.map((alloc) => (
                <div
                  key={alloc.tableNumber}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#11100d] border border-[#d4af37]/25 min-w-0"
                >
                  <span className="text-xs font-bold text-white whitespace-nowrap shrink-0">
                    Table #{alloc.tableNumber}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleSingleTableGuestChange(alloc.tableNumber, alloc.guests - 1)
                      }
                      className="w-6 h-6 rounded-lg bg-[#232019] hover:bg-[#2f2b22] border border-[#d4af37]/35 flex items-center justify-center text-white text-xs cursor-pointer shrink-0"
                      aria-label={`Decrease guests on Table ${alloc.tableNumber}`}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={alloc.guests}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1) {
                          handleSingleTableGuestChange(alloc.tableNumber, val);
                        }
                      }}
                      className="w-11 sm:w-12 py-0.5 text-center bg-[#1b1914] border border-[#d4af37]/40 rounded-lg text-xs font-bold text-[#f3ca52] focus:outline-none shrink-0"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleSingleTableGuestChange(alloc.tableNumber, alloc.guests + 1)
                      }
                      className="w-6 h-6 rounded-lg bg-[#232019] hover:bg-[#2f2b22] border border-[#d4af37]/35 flex items-center justify-center text-white text-xs cursor-pointer shrink-0"
                      aria-label={`Increase guests on Table ${alloc.tableNumber}`}
                    >
                      +
                    </button>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">Bande</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEATING PREFERENCE & OCCASION */}
        <div className="space-y-4 pt-1 border-t border-white/10">
          {/* Seating Preference */}
          <div className="space-y-2">
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
              Seating Preference
            </label>
            <div className="flex flex-wrap gap-2">
              {SEATING_OPTIONS.map((seat) => {
                const active = seatingPreference === seat.id;
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => setSeatingPreference(seat.id)}
                    className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      active
                        ? 'bg-[#2b2413] border border-[#d4af37]/80 text-[#f3ca52] shadow-[0_0_16px_rgba(212,175,55,0.22)]'
                        : 'bg-[#171715] border border-white/10 text-gray-300 hover:border-[#d4af37]/40 hover:text-white'
                    }`}
                  >
                    <span>{seat.icon}</span>
                    <span>{seat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasion (Optional) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Occasion
              </label>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Optional
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map((occ) => {
                const active = occasion === occ;
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccasion(active ? '' : occ)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm transition-all cursor-pointer ${
                      active
                        ? 'bg-[#272214] border border-[#d4af37]/80 text-white font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'bg-[#171715] border border-white/10 text-gray-400 hover:text-gray-200 hover:border-[#d4af37]/40 font-semibold'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-semibold text-[#f3ead8]">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rayyan"
            className="w-full px-4 py-3 sm:py-3.5 bg-[#1c1b18]/90 border border-[#d4af37]/35 rounded-2xl text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-[#f3ca52] transition-colors"
          />
        </div>

        {/* Pakistani Phone with Flag Badge */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-semibold text-[#f3ead8]">
            Pakistani Phone
          </label>
          <div className="flex items-center gap-2.5 px-4 py-3 sm:py-3.5 bg-[#1c1b18]/90 border border-[#d4af37]/35 rounded-2xl focus-within:border-[#f3ca52] transition-colors">
            {/* Pakistan Flag SVG */}
            <div className="w-7 h-5 rounded-[3px] overflow-hidden border border-white/20 flex shrink-0 shadow-xs">
              <div className="w-1/4 h-full bg-white" />
              <div className="w-3/4 h-full bg-[#01411C] flex items-center justify-center text-[10px] text-white leading-none">
                ☪
              </div>
            </div>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03354526628"
              className="w-full bg-transparent text-sm sm:text-base text-white font-mono placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Special Request */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-semibold text-[#f3ead8] text-center">
            Special Request
          </label>
          <input
            type="text"
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder="e.g. Family seating, high chair needed..."
            className="w-full px-4 py-3 sm:py-3.5 bg-[#1c1b18]/90 border border-[#d4af37]/35 rounded-2xl text-sm sm:text-base text-white italic text-center placeholder-gray-400 focus:outline-none focus:border-[#f3ca52] transition-colors"
          />
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-300 bg-rose-950/60 p-3 rounded-xl border border-rose-500/40 text-center">
            {errorMessage}
          </p>
        )}

        {/* RESERVE TABLE Metallic Gold Button */}
        <button
          type="submit"
          className="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#c59b27] hover:brightness-105 active:scale-[0.99] text-gray-950 font-black text-base sm:text-xl tracking-wide uppercase rounded-2xl transition-all shadow-[0_10px_30px_rgba(212,175,55,0.35)] border border-[#fff3b0]/60 cursor-pointer"
        >
          RESERVE TABLE
        </button>
      </form>

      {/* Instant Confirmation Note Below Card */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-gray-300 text-center pt-1">
        <Lock className="w-3.5 h-3.5 text-[#e5c158] shrink-0" />
        <span>Your reservation is confirmed instantly • No prepayment required</span>
      </div>
    </div>
  );
};

export const TableReservationModal: React.FC = () => {
  const { isTableReservationModalOpen, setIsTableReservationModalOpen } = useRestaurant();

  if (!isTableReservationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto overscroll-contain">
      <div className="w-full max-w-lg my-auto max-h-[92dvh] overflow-y-auto animate-booking-unfold scrollbar-none">
        <TableReservationFormCard onCloseModal={() => setIsTableReservationModalOpen(false)} />
      </div>
    </div>
  );
};

export const TableBookingSection: React.FC = () => {
  return null;
};
