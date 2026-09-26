import React, { useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceHighlightsSection } from './components/ServiceHighlightsSection';
import { MenuSection } from './components/MenuSection';
import { DealsSection } from './components/DealsSection';
import { TableBookingSection, TableReservationModal } from './components/TableBookingSection';
import { GallerySection } from './components/GallerySection';
import { AboutSection } from './components/AboutSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer } from './components/CartDrawer';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrdersModal } from './components/OrdersModal';
import { BookingsModal } from './components/BookingsModal';
import { FavoritesModal } from './components/FavoritesModal';
import { ReviewModal } from './components/ReviewModal';
import { DemoWebsiteNoticeToast } from './components/DemoWebsiteNoticeToast';
import { UpdatesModal } from './components/UpdatesModal';

const RestaurantAppContent: React.FC = () => {
  const { customizingItem, setCustomizingItem, addedItemToast, socialToast, setIsTableReservationModalOpen } = useRestaurant();

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!target) return;
      const hash = target.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const sectionId = hash.slice(1);
      if (sectionId === 'book-table') {
        e.preventDefault();
        setIsTableReservationModalOpen(true);
        return;
      }
      const sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('section-navigate', { detail: sectionId }));
        if (sectionId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Smooth scroll-reveal observer for sections
    const sections = document.querySelectorAll('main > section:not(#home)');
    sections.forEach((sec) => sec.classList.add('section-smooth-reveal'));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );

    sections.forEach((sec) => revealObserver.observe(sec));

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      revealObserver.disconnect();
    };
  }, [setIsTableReservationModalOpen]);

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-[#f4efe6] flex flex-col font-sans transition-colors duration-300 selection:bg-amber-500/30 selection:text-amber-950">
      {/* Fixed Non-Scrolling Luxury Restaurant Pattern Background */}
      <div className="fixed-restaurant-bg" aria-hidden="true" />

      {/* 5-second popup notice for demo version */}
      <DemoWebsiteNoticeToast />

      {/* Floating Add to Cart Toast Animation */}
      {addedItemToast && (
        <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 bg-[#16181e] text-white border border-amber-500/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-modal-pop backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-gray-950 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <div className="text-xs font-bold text-white">Added to Cart!</div>
            <div className="text-[11px] text-gray-400 truncate max-w-[160px]">{addedItemToast}</div>
          </div>
        </div>
      )}

      {/* Social Media / Info Toast (e.g. TikTok Not Available) */}
      {socialToast && (
        <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#141720] text-white border border-amber-500/50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-modal-pop backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs sm:text-sm font-bold text-amber-300">{socialToast}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Navbar />

      {/* Main Page Sections (Scrolls over the fixed background) */}
      <main className="relative z-10 flex-1">
        <Hero />
        <MenuSection />
        <DealsSection />
        <GallerySection />
        <ServiceHighlightsSection />
        <AboutSection />
        <ReviewsSection />
        <LocationSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Thumb Navigation */}
      <MobileBottomNav />

      {/* Overlays, Drawers & Modals */}
      <CartDrawer />
      <ItemCustomizerModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
      />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrdersModal />
      <BookingsModal />
      <TableReservationModal />
      <UpdatesModal />
      <FavoritesModal />
      <ReviewModal />
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <RestaurantAppContent />
    </RestaurantProvider>
  );
}
