import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Shield, X, Check } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const UpdatesModal: React.FC = () => {
  const { isUpdatesModalOpen, setIsUpdatesModalOpen } = useRestaurant();
  const [selectedId, setSelectedId] = useState<'admin' | 'hours' | null>(null);
  const [markedRead, setMarkedRead] = useState(false);

  useEffect(() => {
    if (isUpdatesModalOpen) {
      setSelectedId(null);
    }
  }, [isUpdatesModalOpen]);

  if (!isUpdatesModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 overscroll-contain animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsUpdatesModalOpen(false);
      }}
    >
      <div
        className="relative w-full max-w-[420px] max-h-[92dvh] flex flex-col bg-[#0c0d10] border border-[#d4af37]/30 rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden animate-modal-pop text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="updates-modal-title"
      >
        {/* Subtle stone/luxury radial glow background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 18%, rgba(212, 175, 55, 0.14) 0%, transparent 55%), radial-gradient(circle at 80% 85%, rgba(212, 175, 55, 0.06) 0%, transparent 50%)',
          }}
        />

        {selectedId === null ? (
          /* =====================================================================
             STEP 1: MASTER LIST VIEW (EXACT MATCH TO SCREENSHOT #2)
             ===================================================================== */
          <div className="relative z-10 flex flex-col flex-1 overflow-y-auto px-5 sm:px-7 pt-8 pb-6 justify-between min-h-[540px]">
            {/* Top-right subtle close button */}
            <button
              type="button"
              onClick={() => setIsUpdatesModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-[#e5c158] hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Centered Gold Serif Header */}
              <div className="text-center space-y-2.5 pt-2">
                <h2
                  id="updates-modal-title"
                  className="text-2xl sm:text-[30px] font-serif font-normal text-[#e5c478] tracking-tight leading-tight"
                >
                  Notifications &amp; Updates
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-300 font-normal tracking-wide">
                  Official announcements from Sandh Restaurant • Gulshan-e-Iqbal, Karachi
                </p>
              </div>

              {/* Top Gold Divider Line */}
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#d4af37]/45 to-transparent" />

              {/* Notification Headline Items */}
              <div className="divide-y divide-[#d4af37]/25 border-b border-[#d4af37]/25">
                {/* Item 1: ADMIN INFO */}
                <button
                  type="button"
                  onClick={() => setSelectedId('admin')}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left group hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Circular Gold Shield/Admin Icon */}
                    <div className="w-14 h-14 rounded-full border border-[#d4af37]/55 bg-[#121317] flex items-center justify-center shrink-0 group-hover:border-[#f3d066] group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-7 h-7 text-[#e5c478]"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"
                        />
                        <circle cx="12" cy="10" r="2.3" />
                        <path
                          strokeLinecap="round"
                          d="M8.5 16c.8-1.8 2.1-2.6 3.5-2.6s2.7.8 3.5 2.6"
                        />
                      </svg>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#e5c478]">
                        ADMIN INFO
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-[#f7df8b] transition-colors">
                        Admin Panel, Rider Panel &amp; Complete Website Package
                      </h3>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#c9a85c] group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* Item 2: UPDATE (Daily Operating Hours) */}
                <button
                  type="button"
                  onClick={() => setSelectedId('hours')}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left group hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Circular Gold Clock Icon */}
                    <div className="w-14 h-14 rounded-full border border-[#d4af37]/55 bg-[#121317] flex items-center justify-center shrink-0 group-hover:border-[#f3d066] group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                      <Clock className="w-7 h-7 text-[#e5c478] stroke-[1.6]" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#e5c478]">
                        UPDATE
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-[#f7df8b] transition-colors">
                        Daily Operating Hours:
                        <span className="block">12 PM–12 AM</span>
                      </h3>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#c9a85c] group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>

            {/* Bottom Mark all as read Bar (Matching Screenshot #2) */}
            <div className="mt-8 p-3.5 rounded-2xl bg-[#14151a]/90 border border-white/5 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setMarkedRead(true)}
                className="px-6 py-2 rounded-full border border-[#d4af37]/60 hover:border-[#f3d066] bg-[#171612] hover:bg-[#d4af37]/15 text-[#f3dfb2] text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                {markedRead && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{markedRead ? 'All Marked as Read' : 'Mark all as read'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* =====================================================================
             STEP 2: INNER DETAIL PAGE (EXACT MATCH TO SCREENSHOT #3)
             ===================================================================== */
          <div className="relative z-10 flex flex-col flex-1 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-250">
            {/* Top Navigation Bar: < Back | CATEGORY TITLE */}
            <div className="px-5 py-4 border-b border-[#d4af37]/20 flex items-center justify-between bg-[#121318]/90 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="p-1 -ml-1 text-[#e5c478] hover:text-white transition-colors cursor-pointer"
                aria-label="Back to notifications list"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2]" />
              </button>

              <span className="font-serif text-xs sm:text-sm uppercase tracking-[0.16em] text-[#e5c478]">
                {selectedId === 'hours' ? 'OPERATING HOURS' : 'ADMIN INFO'}
              </span>

              <div className="w-6" />
            </div>

            {/* Scrollable Detail Content */}
            <div className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Glowing Golden Emblem Visual */}
                <div className="relative flex justify-center py-2">
                  {/* Radial Golden Glow */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-36 rounded-full bg-[#d4af37]/25 blur-2xl" />
                  </div>

                  {selectedId === 'hours' ? (
                    /* Luxury Golden Roman-Numeral Pocket Watch SVG (Matching Screenshot #3) */
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_0_25px_rgba(243,202,82,0.5)]">
                        <defs>
                          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fff3b0" />
                            <stop offset="45%" stopColor="#d4af37" />
                            <stop offset="100%" stopColor="#8a6614" />
                          </linearGradient>
                          <radialGradient id="watchFace" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#262218" />
                            <stop offset="100%" stopColor="#0f0e0b" />
                          </radialGradient>
                        </defs>
                        {/* Top Crown Loop */}
                        <ellipse cx="80" cy="15" rx="11" ry="7" fill="none" stroke="url(#goldRim)" strokeWidth="3.5" />
                        <rect x="75" y="20" width="10" height="7" rx="2" fill="url(#goldRim)" />
                        {/* Outer Gold Case */}
                        <circle cx="80" cy="86" r="58" fill="url(#watchFace)" stroke="url(#goldRim)" strokeWidth="6" />
                        <circle cx="80" cy="86" r="51" fill="none" stroke="#fce38a" strokeWidth="1" strokeOpacity="0.6" />
                        {/* Roman Numeral Markers */}
                        <text x="80" y="47" textAnchor="middle" fill="#f5d77f" fontSize="10" fontFamily="serif" fontWeight="bold">XII</text>
                        <text x="122" y="90" textAnchor="middle" fill="#f5d77f" fontSize="10" fontFamily="serif" fontWeight="bold">III</text>
                        <text x="80" y="131" textAnchor="middle" fill="#f5d77f" fontSize="10" fontFamily="serif" fontWeight="bold">VI</text>
                        <text x="38" y="90" textAnchor="middle" fill="#f5d77f" fontSize="10" fontFamily="serif" fontWeight="bold">IX</text>
                        {/* Watch Hands */}
                        <line x1="80" y1="86" x2="58" y2="72" stroke="url(#goldRim)" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="80" y1="86" x2="108" y2="68" stroke="url(#goldRim)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="80" cy="86" r="4.5" fill="#fff3b0" />
                      </svg>
                    </div>
                  ) : (
                    /* Luxury Golden Admin Shield Emblem */
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full border-2 border-[#e5c158] bg-gradient-to-b from-[#282213] to-[#110f0a] flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.45)]">
                        <Shield className="w-14 h-14 text-[#f5d77f] stroke-[1.6]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Large Centered Gold Serif Title */}
                <div className="text-center space-y-1">
                  {selectedId === 'hours' ? (
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#f3dfb2] leading-tight">
                      Daily Operating Hours:
                      <span className="block mt-0.5">12 PM–12 AM</span>
                    </h3>
                  ) : (
                    <h3 className="text-xl sm:text-2xl font-serif text-[#f3dfb2] leading-snug px-2">
                      Admin Panel, Rider Panel &amp; Complete Website Package
                    </h3>
                  )}
                </div>

                {/* Divider with Right-Aligned Gold Pill Tag (Matching Screenshot #3) */}
                <div className="relative flex items-center justify-end pt-1">
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-[#d4af37]/40" />
                  <span className="relative z-10 px-3.5 py-1 rounded-full bg-[#191712] border border-[#d4af37]/60 text-[10px] font-bold uppercase tracking-wider text-[#f3dfb2]">
                    {selectedId === 'hours' ? 'UPDATE' : 'ADMIN INFO'}
                  </span>
                </div>

                {/* Detailed Body Text Paragraphs */}
                {selectedId === 'hours' ? (
                  <div className="space-y-4 text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                    <p>
                      We have extended our evening hours to serve you late into the night. Our kitchen remains open throughout operating hours to bring you the finest contemporary Pakistani dining experience.
                    </p>
                    <p>
                      Last orders are accepted 30 minutes before closing at 12:00 AM to ensure your meal is prepared fresh and served with the same attention to detail.
                    </p>
                    <p>
                      Reservations are recommended for dinner service and can be made via the app or by calling our host. For private dining and special occasions, please contact our concierge team.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                    <p className="text-white font-medium bg-[#171612] p-3.5 rounded-2xl border border-[#d4af37]/35">
                      Admin panel se post kr sakte ha ya demo version ha dekhna ke lya ha apko website puri chye jis ke saath admin panel rider panel or bhi alag option jo hote ha wo milenge alag milenge.
                    </p>
                    <p>
                      Is complete restaurant package mein aapko Live Order Management, Rider Tracking Panel, Menu &amp; Price Editor, Table Reservation Control, aur Custom Announcements post karne ka mukammal Admin Panel milta hai.
                    </p>
                    <p>
                      Apne restaurant ya business ke liye mukammal website, Admin Panel aur Rider Panel banwane ke liye rabta karein:{' '}
                      <a href="tel:03481807287" className="text-[#f3ca52] font-mono font-bold underline">
                        03481807287
                      </a>
                      .
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Meta Row & Full-Width Close Button (Matching Screenshot #3) */}
              <div className="pt-4 space-y-4">
                <div className="border-t border-white/10 pt-3.5 flex items-center gap-2.5 text-xs text-[#e5c478]">
                  <Calendar className="w-4 h-4 text-[#e5c478] shrink-0" />
                  <span className="font-medium">
                    {selectedId === 'hours'
                      ? 'Daily • 7 Days a Week • Reservations Recommended'
                      : 'Complete Website • Admin Panel • Rider App Included'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUpdatesModalOpen(false)}
                  className="w-full py-3.5 rounded-2xl bg-[#141416] hover:bg-[#1e1d18] border border-[#d4af37]/55 text-[#f3dfb2] font-semibold text-sm transition-all cursor-pointer active:scale-98"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
