import React from 'react';
import { X, Calendar, Clock, Users } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const BookingsModal: React.FC = () => {
  const {
    isBookingsOpen,
    setIsBookingsOpen,
    setIsTableReservationModalOpen,
    bookings,
    advanceBookingStatus,
  } = useRestaurant();

  if (!isBookingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overscroll-contain animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[88dvh] sm:max-h-[90dvh] flex flex-col bg-white dark:bg-[#121419] border border-amber-500/30 dark:border-[#272b38] rounded-2xl shadow-2xl overflow-hidden my-auto animate-booking-unfold"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookings-title"
      >
        {/* Fixed Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-[#1f232d] flex items-center justify-between bg-white dark:bg-[#121419] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-[#181b22] border border-amber-200 dark:border-[#2b303d] flex items-center justify-center text-amber-600 dark:text-[#d4af37]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 id="bookings-title" className="text-lg sm:text-xl font-serif font-bold text-gray-900 dark:text-[#fbf7ee]">
                My Bookings
              </h2>
              <p className="text-xs text-gray-500 dark:text-[#8690a0]">
                {bookings.length} {bookings.length === 1 ? 'reservation' : 'reservations'} saved locally
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBookingsOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-[#f4efe6] hover:bg-gray-100 dark:hover:bg-[#1a1d26] rounded-lg transition-colors cursor-pointer"
            aria-label="Close bookings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Bookings List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12 space-y-3 animate-booking-stagger">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#181a22] border border-gray-200 dark:border-[#272b36] flex items-center justify-center text-gray-400 mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-[#fbf7ee]">No table reservations yet</p>
              <p className="text-xs text-gray-500 dark:text-[#848d9c] max-w-xs mx-auto">
                Reserve your table for today or upcoming dates at Sandh Restaurant.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsBookingsOpen(false);
                    setIsTableReservationModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-gray-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book a Table Now</span>
                </button>
              </div>
            </div>
          ) : (
            bookings.map((booking, idx) => (
              <div
                key={booking.bookingNumber}
                style={{ animationDelay: `${idx * 70}ms` }}
                className="p-4 sm:p-5 bg-gray-50 dark:bg-[#161820] border border-gray-200 dark:border-[#242834] rounded-xl space-y-3 animate-booking-stagger"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-base text-gray-900 dark:text-[#fbf7ee]">
                      Booking #{booking.bookingNumber}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-[#848e9f] block">
                      Guest: {booking.customerName} ({booking.phoneNumber})
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-bold capitalize ${
                      booking.status === 'confirmed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {booking.status === 'confirmed' ? 'Confirmed' : 'Pending Confirmation'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white dark:bg-[#101217] p-3 rounded-lg border border-gray-200 dark:border-[#1d2029]">
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-[#788293] block font-medium">Date</span>
                    <span className="font-bold text-gray-900 dark:text-[#fbf7ee]">{booking.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-[#788293] block font-medium">Arrival Time</span>
                    <span className="font-bold text-amber-600 dark:text-[#d4af37]">{booking.arrivalTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-[#788293] block font-medium">Guests & Tables</span>
                    <span className="font-bold text-gray-900 dark:text-[#fbf7ee]">
                      {booking.guests} Members ({booking.tableCount || 1} {(booking.tableCount || 1) === 1 ? 'Table' : 'Tables'})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-[#788293] block font-medium">Seating</span>
                    <span className="font-bold text-amber-600 dark:text-[#d4af37]">
                      {booking.seatingPreference || 'Indoor'}
                    </span>
                  </div>
                </div>

                {booking.tableAllocations && booking.tableAllocations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {booking.tableAllocations.map((alloc) => (
                      <span
                        key={alloc.tableNumber}
                        className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-600 dark:text-[#f3ca52]"
                      >
                        Table #{alloc.tableNumber}: {alloc.guests} {alloc.guests === 1 ? 'Banda' : 'Bande'}
                      </span>
                    ))}
                  </div>
                )}

                {booking.occasion && (
                  <p className="text-xs text-gray-600 dark:text-[#c4cddb]">
                    Occasion: <strong className="text-amber-600 dark:text-[#d4af37]">{booking.occasion}</strong>
                  </p>
                )}

                {booking.specialRequest && (
                  <p className="text-xs text-gray-500 dark:text-[#8e98aa] italic">
                    Special Request: "{booking.specialRequest}"
                  </p>
                )}

                <div className="pt-2 border-t border-gray-200 dark:border-[#222633] flex justify-end">
                  <button
                    type="button"
                    onClick={() => advanceBookingStatus(booking.bookingNumber)}
                    className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#202532] hover:bg-gray-100 dark:hover:bg-[#2a3040] text-gray-800 dark:text-[#f4efe6] rounded-lg border border-gray-300 dark:border-[#333b4e] transition-colors cursor-pointer"
                  >
                    Toggle Status (Demo Simulation)
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fixed Sticky Footer */}
        <div className="p-3.5 sm:p-4 bg-gray-50 dark:bg-[#141720] border-t border-gray-200 dark:border-[#1f232d] shrink-0 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              setIsBookingsOpen(false);
              setIsTableReservationModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
          >
            + New Table Reservation
          </button>
          <button
            onClick={() => setIsBookingsOpen(false)}
            className="px-5 py-2 bg-gray-200 dark:bg-[#202532] hover:bg-gray-300 dark:hover:bg-[#2a3040] text-gray-800 dark:text-[#f4efe6] font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
          >
            Close Bookings
          </button>
        </div>
      </div>
    </div>
  );
};
