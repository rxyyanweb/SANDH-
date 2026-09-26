import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, X, Info, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const DemoWebsiteNoticeToast: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // 5 seconds delay after website load
    const showTimer = setTimeout(() => {
      setIsVisible(true);

      // 3.5 seconds countdown progress bar
      const startTime = Date.now();
      const duration = 3500;

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (elapsed >= duration) {
          clearInterval(progressInterval);
          setIsVisible(false);
        }
      }, 50);

      return () => clearInterval(progressInterval);
    }, 5000);

    return () => clearTimeout(showTimer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] bg-white dark:bg-[#14161c] border border-amber-500/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Auto-dismiss progress countdown bar */}
      <div
        className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-[#d4af37] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-[#d4af37] font-bold block">
                Official Notice · Demo Version
              </span>
              <h4 className="text-sm font-serif font-bold text-gray-900 dark:text-[#fbf7ee]">
                Restaurant Website Demo
              </h4>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-[#f4efe6] hover:bg-gray-100 dark:hover:bg-[#1f232c] rounded-md transition-colors cursor-pointer"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-600 dark:text-[#cbd5e1] leading-relaxed">
          This is a <strong className="text-gray-900 dark:text-[#fbf7ee]">demo version</strong>. If you would like a custom modern website designed for your restaurant or business, contact{' '}
          <a
            href="tel:03481807287"
            className="text-amber-700 dark:text-[#d4af37] font-mono font-bold hover:underline"
          >
            03481807287
          </a>
          .
        </p>

        <div className="flex items-center gap-2 pt-1">
          <a
            href="tel:03481807287"
            className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-gray-950 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 0348 1807287</span>
          </a>

          <a
            href="https://wa.me/923481807287"
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-1.5 px-3 bg-gray-100 dark:bg-[#1e232e] hover:bg-gray-200 dark:hover:bg-[#282f3d] text-gray-900 dark:text-[#f4efe6] font-semibold text-[11px] rounded-lg border border-gray-300 dark:border-[#2f3747] transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
