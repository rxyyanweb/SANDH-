import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Share2, Check, ArrowRight, ShoppingBag } from 'lucide-react';
import { MenuItem, SelectedAddon, MenuAddon } from '../types/restaurant';
import { useRestaurant } from '../context/RestaurantContext';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  directOrder?: boolean;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({ item, onClose, directOrder = false }) => {
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useRestaurant();

  const [selectedSize, setSelectedSize] = useState<string>('');
  // For Extra toppings (Desi Ghee, Butter, Olive Oil) - checkbox / toggle
  const [selectedToppings, setSelectedToppings] = useState<Record<string, boolean>>({});
  // For Breads (Naan, Paratha) and Raita / Salads - quantity counters (so customer can choose how many they want)
  const [quantitiesByAddon, setQuantitiesByAddon] = useState<Record<string, number>>({});
  
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [mainQuantity, setMainQuantity] = useState<number>(1);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const effectiveSizes =
    item && item.sizes && item.sizes.length >= 2
      ? item.sizes
      : item
        ? [
            { name: 'Half', price: item.basePrice, serves: '1-2 persons' },
            { name: 'Full', price: Math.round((item.basePrice * 1.85) / 10) * 10, serves: '3-4 persons' },
          ]
        : [];

  useEffect(() => {
    if (item) {
      const sizesToUse =
        item.sizes && item.sizes.length >= 2
          ? item.sizes
          : [
              { name: 'Half', price: item.basePrice, serves: '1-2 persons' },
              { name: 'Full', price: Math.round((item.basePrice * 1.85) / 10) * 10, serves: '3-4 persons' },
            ];
      setSelectedSize(sizesToUse[0].name);

      // Reset
      setSelectedToppings({});
      setQuantitiesByAddon({});
      setSpecialInstructions('');

      // Enforce min 4 quantity if Rs 70 naan
      if (item.basePrice === 70) {
        setMainQuantity(4);
      } else {
        setMainQuantity(1);
      }
    }
  }, [item]);

  if (!item) return null;

  // Calculate price based on selected size
  let unitPrice = item.basePrice;
  if (selectedSize && effectiveSizes.length > 0) {
    const matched = effectiveSizes.find((s) => s.name === selectedSize);
    if (matched) unitPrice = matched.price;
  }

  // Standard full options matching Screenshots 1, 2, 3 for all dishes
  const extraToppings: MenuAddon[] = [
    { id: 'desi_ghee', name: 'Desi Ghee', price: 200, category: 'addon' },
    { id: 'butter', name: 'Butter', price: 200, category: 'addon' },
    { id: 'olive_oil', name: 'Olive Oil', price: 300, category: 'addon' },
  ];

  const breadOptions: MenuAddon[] = [
    { id: 'paratha', name: 'Crispy Paratha', price: 90, category: 'bread' },
    { id: 'roghni_naan', name: 'Roghni Naan', price: 70, category: 'bread' },
    { id: 'garlic_naan', name: 'Garlic Naan', price: 110, category: 'bread' },
    { id: 'sada_naan', name: 'Sada Naan', price: 40, category: 'bread' },
  ];

  const raitaOptions: MenuAddon[] = [
    { id: 'zeera_raita', name: 'Zeera Raita', price: 90, category: 'raita' },
    { id: 'mint_raita', name: 'Mint Raita', price: 80, category: 'raita' },
    { id: 'fresh_salad', name: 'Fresh Kachumber Salad', price: 90, category: 'raita' },
  ];

  // Calculate toppings price (per dish portion)
  let toppingsCost = 0;
  extraToppings.forEach((top) => {
    if (selectedToppings[top.id]) {
      toppingsCost += top.price;
    }
  });

  // Calculate breads and raita cost (independent quantity)
  let breadRaitaCost = 0;
  breadOptions.forEach((b) => {
    const qty = quantitiesByAddon[b.id] || 0;
    breadRaitaCost += b.price * qty;
  });
  raitaOptions.forEach((r) => {
    const qty = quantitiesByAddon[r.id] || 0;
    breadRaitaCost += r.price * qty;
  });

  // Total price = (unitPrice + toppingsCost) * mainQuantity + breadRaitaCost
  const totalPrice = (unitPrice + toppingsCost) * mainQuantity + breadRaitaCost;

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) => ({
      ...prev,
      [toppingId]: !prev[toppingId],
    }));
  };

  const updateAddonQty = (addonId: string, delta: number, minLimit: number = 0) => {
    setQuantitiesByAddon((prev) => {
      const current = prev[addonId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[addonId];
        return copy;
      }
      if (next < minLimit) return prev;
      return { ...prev, [addonId]: next };
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out ${item.name} at Sandh Restaurant:`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(`${item.name} - Sandh Restaurant: ${window.location.href}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const buildSelectedAddonsList = (): SelectedAddon[] => {
    const list: SelectedAddon[] = [];
    
    // Toppings (Desi Ghee, Butter, Olive Oil)
    extraToppings.forEach((top) => {
      if (selectedToppings[top.id]) {
        list.push({
          addonId: top.id,
          name: top.name,
          price: top.price,
          quantity: 1,
        });
      }
    });

    // Breads (Naan, Paratha)
    breadOptions.forEach((b) => {
      const q = quantitiesByAddon[b.id] || 0;
      if (q > 0) {
        list.push({
          addonId: b.id,
          name: b.name,
          price: b.price,
          quantity: q,
        });
      }
    });

    // Raita / Salad
    raitaOptions.forEach((r) => {
      const q = quantitiesByAddon[r.id] || 0;
      if (q > 0) {
        list.push({
          addonId: r.id,
          name: r.name,
          price: r.price,
          quantity: q,
        });
      }
    });

    return list;
  };

  const handleAddToCart = () => {
    const addonsList = buildSelectedAddonsList();
    addToCart(item, selectedSize || undefined, addonsList, specialInstructions, mainQuantity);
    onClose();
  };

  const handleOrderNow = () => {
    const addonsList = buildSelectedAddonsList();
    addToCart(item, selectedSize || undefined, addonsList, specialInstructions, mainQuantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overscroll-contain animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-[430px] max-h-[90dvh] flex flex-col bg-[#1e2025] text-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-gray-800 animate-modal-pop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customizer-item-title"
      >
        {/* Top Media Header with Circular Share and Close Buttons */}
        <div className="relative aspect-[4/3] w-full bg-gray-950 shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e2025] via-transparent to-black/40 pointer-events-none" />

          {/* Floating Action Buttons: Share & Close X */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/70 hover:bg-black backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer shadow-md border border-white/10"
              title="Share item"
              aria-label="Share item"
            >
              {copiedShare ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/70 hover:bg-black backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer shadow-md border border-white/10"
              title="Close"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-gray-200">
          {/* Title & Description */}
          <div>
            <h2 id="customizer-item-title" className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight leading-snug">
              {item.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-normal leading-relaxed mt-2">
              {item.description}
            </p>
          </div>

          {/* 1. SELECT SIZE */}
          {effectiveSizes.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-white font-sans tracking-tight">
                Select Size
              </h3>

              <div className="space-y-2">
                {effectiveSizes.map((size) => {
                  const isSelected = selectedSize === size.name;
                  return (
                    <div
                      key={size.name}
                      onClick={() => setSelectedSize(size.name)}
                      className={`w-full p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/15 shadow-md'
                          : 'border-gray-800 hover:border-gray-700 bg-[#16181e]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? 'border-amber-400 border-2' : 'border-gray-600'
                          }`}
                        >
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                        </div>
                        <span className="text-sm font-medium text-white font-sans">
                          {size.name}
                        </span>
                      </div>

                      <span className="text-sm font-bold font-mono text-amber-400">
                        Rs.{size.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. EXTRA TOPPINGS (Desi Ghee, Butter, Olive Oil) */}
          {extraToppings.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-sans tracking-tight">
                  Extra Ghee & Butter
                </h3>
                <span className="text-[11px] text-gray-400">Optional</span>
              </div>

              <div className="space-y-2">
                {extraToppings.map((addon) => {
                  const isChecked = !!selectedToppings[addon.id];
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleTopping(addon.id)}
                      className={`w-full p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-amber-500 bg-amber-500/15 shadow-md'
                          : 'border-gray-800 hover:border-gray-700 bg-[#16181e]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-gray-950 font-black'
                              : 'border-gray-600 bg-transparent'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm font-medium text-white font-sans">
                          {addon.name}
                        </span>
                      </div>

                      <span className="text-sm font-bold font-mono text-amber-400">
                        Rs.{addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. PARATHA & TANDOORI NAAN */}
          {breadOptions.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-sans tracking-tight">
                  Tandoori Breads & Paratha
                </h3>
                <span className="text-[11px] text-gray-400">Select quantity</span>
              </div>

              <div className="divide-y divide-gray-800 border border-gray-800 rounded-2xl overflow-hidden bg-[#16181e]">
                {breadOptions.map((bread) => {
                  const qty = quantitiesByAddon[bread.id] || 0;
                  return (
                    <div
                      key={bread.id}
                      className="p-3.5 flex items-center justify-between gap-3 bg-[#16181e]"
                    >
                      <div>
                        <div className="text-sm font-medium text-white font-sans">
                          {bread.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          Rs.{bread.price} each {bread.id === 'roghni_naan' && <span className="text-amber-400">(Min. 4)</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-black border border-gray-700 rounded-full px-2.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateAddonQty(bread.id, -1, bread.id === 'roghni_naan' ? 4 : 0)}
                          disabled={qty === 0}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          aria-label={`Decrease ${bread.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="w-5 text-center font-bold text-xs text-white font-mono">
                          {qty}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            if (qty === 0 && bread.id === 'roghni_naan') {
                              updateAddonQty(bread.id, 4);
                            } else {
                              updateAddonQty(bread.id, 1);
                            }
                          }}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                          aria-label={`Increase ${bread.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. RAITA & FRESH SALAD */}
          {raitaOptions.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-sans tracking-tight">
                  Raita & Fresh Salad
                </h3>
                <span className="text-[11px] text-gray-400">Accompaniments</span>
              </div>

              <div className="divide-y divide-gray-800 border border-gray-800 rounded-2xl overflow-hidden bg-[#16181e]">
                {raitaOptions.map((ra) => {
                  const qty = quantitiesByAddon[ra.id] || 0;
                  return (
                    <div
                      key={ra.id}
                      className="p-3.5 flex items-center justify-between gap-3 bg-[#16181e]"
                    >
                      <div>
                        <div className="text-sm font-medium text-white font-sans">
                          {ra.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          Rs.{ra.price}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-black border border-gray-700 rounded-full px-2.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateAddonQty(ra.id, -1)}
                          disabled={qty === 0}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          aria-label={`Decrease ${ra.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="w-5 text-center font-bold text-xs text-white font-mono">
                          {qty}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateAddonQty(ra.id, 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                          aria-label={`Increase ${ra.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. SPECIAL INSTRUCTIONS */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-white font-sans tracking-tight">
              Special Instructions
            </h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less spicy, gravy thick, extra napkins"
              rows={3}
              maxLength={150}
              className="w-full px-3.5 py-3 rounded-2xl border border-gray-800 bg-[#121419] placeholder-gray-500 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Sticky Bottom Bar with Stepper & 2 spacious action buttons */}
        <div className="p-3.5 sm:p-4 bg-[#17181d] border-t border-gray-800 shrink-0 space-y-2.5">
          {/* Top Row: Stepper on Left, Total Price on Right */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 bg-black border border-gray-700 rounded-full px-3 py-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setMainQuantity((q) => Math.max(item.basePrice === 70 ? 4 : 1, q - 1))}
                disabled={mainQuantity <= (item.basePrice === 70 ? 4 : 1)}
                className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm text-white font-mono w-5 text-center">
                {mainQuantity}
              </span>
              <button
                type="button"
                onClick={() => setMainQuantity((q) => q + 1)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 block leading-tight">Total Price</span>
              <span className="font-mono font-bold text-base text-amber-400 leading-tight">
                Rs. {totalPrice}
              </span>
            </div>
          </div>

          {/* Action Buttons: Add to Cart and Direct Delivery Order */}
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={handleAddToCart}
              className="py-3 px-3 bg-black hover:bg-gray-900 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl border border-gray-700 shadow-md transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleOrderNow}
              title="Direct Delivery Order"
              className="py-3 px-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-gray-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
