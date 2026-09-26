import React, { useState } from 'react';
import { Image as ImageIcon, X, ZoomIn, Eye } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/restaurantData';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);

  const categories = ['All', 'Special Dishes', 'Food', 'Restaurant Interior', 'Exterior'];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-[#0e1014] border-t border-[#1d2027]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#20242e]">
          <div>
            <div className="text-xs font-semibold text-[#d4af37] tracking-wider uppercase">
              Visual Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#fbf7ee] mt-1">
              Our Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#959eaf] mt-1 max-w-xl">
              A curated look into our culinary offerings, dining atmosphere, and Gulshan-e-Iqbal location.
            </p>
          </div>

          {/* Transparent Notice */}
          <div className="text-[11px] text-[#788293] bg-[#14161c] px-3 py-1.5 rounded-lg border border-[#222530] max-w-xs">
            * Official high-resolution restaurant photos will be updated by management.
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#d4af37] text-[#0c0d0e] font-semibold'
                  : 'bg-[#15171d] text-[#8e98aa] hover:text-[#f4efe6] border border-[#21242e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className="group cursor-pointer bg-[#14161c] border border-[#232732] hover:border-[#3a4152] rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              {item.image ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-[#181a20]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 bg-black/70 backdrop-blur-sm rounded-full text-[#d4af37] border border-[#d4af37]/30">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-[#171a22] to-[#111317] border-b border-[#212530] flex flex-col items-center justify-center p-6 text-center space-y-2 group-hover:border-[#d4af37]/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#1e222c] border border-[#2c3343] flex items-center justify-center text-[#d4af37]">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-[#f4efe6]">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-[#717b8c] uppercase tracking-wider">
                    {item.category} Photo Card
                  </span>
                </div>
              )}

              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#d4af37] font-medium">
                  <span>{item.category}</span>
                  <span className="text-[#646e7f] flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Preview
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#fbf7ee] group-hover:text-[#d4af37] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#8c96a7] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#121419] border border-[#292f3f] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-[#121419]/80 backdrop-blur-sm rounded-full text-[#9ca3af] hover:text-[#f4efe6] border border-[#2b303e]"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>

            {activeLightboxItem.image ? (
              <div className="w-full aspect-[16/10] overflow-hidden bg-[#181a20]">
                <img
                  src={activeLightboxItem.image}
                  alt={activeLightboxItem.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-[#191d26] to-[#101216] flex flex-col items-center justify-center p-6 text-center space-y-2">
                <ImageIcon className="w-12 h-12 text-[#d4af37]/60" />
                <p className="text-sm font-semibold text-[#f4efe6]">
                  {activeLightboxItem.title}
                </p>
                <p className="text-xs text-[#7d8697]">
                  Photograph placeholder for Al Jannat restaurant facilities.
                </p>
              </div>
            )}

            <div className="p-6 space-y-2">
              <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
                {activeLightboxItem.category}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#fbf7ee]">
                {activeLightboxItem.title}
              </h3>
              <p className="text-sm text-[#959fad] leading-relaxed">
                {activeLightboxItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
