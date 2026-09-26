import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Search,
  CheckCircle2,
  Phone,
  ShoppingBag,
  X,
  FileText,
  Clock,
  MapPin,
  CreditCard,
  Calendar,
  User,
  Printer,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { MENU_ITEMS, RESTAURANT_INFO } from '../data/restaurantData';
import { CustomerOrder, PaymentMethod } from '../types/restaurant';

function formatElapsedMMSS(ms: number): string {
  const totalSec = Math.max(1, Math.floor(ms / 1000));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'cash_on_delivery':
      return 'Cash on Delivery (COD)';
    case 'payment_at_pickup':
      return 'Payment at Pickup';
    case 'pay_at_restaurant':
      return 'Pay at Restaurant (Dine-in)';
    default:
      return 'Cash on Delivery';
  }
}

export const OrdersModal: React.FC = () => {
  const {
    isOrdersOpen,
    setIsOrdersOpen,
    orders,
    reorder,
    advanceOrderStatus,
    setReviewingOrder,
  } = useRestaurant();

  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceiptOrderNum, setSelectedReceiptOrderNum] = useState<string | null>(null);

  useEffect(() => {
    if (!isOrdersOpen) {
      setSelectedReceiptOrderNum(null);
      return;
    }
    setNowMs(Date.now());
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOrdersOpen]);

  if (!isOrdersOpen) return null;

  const selectedReceiptOrder: CustomerOrder | null = selectedReceiptOrderNum
    ? orders.find((o) => o.orderNumber === selectedReceiptOrderNum) || null
    : null;

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchId = o.orderNumber.toLowerCase().includes(q);
    const matchName = o.customerName.toLowerCase().includes(q);
    const matchItem = o.items.some((i) => i.name.toLowerCase().includes(q));
    return matchId || matchName || matchItem;
  });

  const renderStatusLabel = (status: CustomerOrder['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'On the Way';
      case 'confirmed':
        return 'Confirmed';
      default:
        return 'Order Received';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overscroll-contain animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOrdersOpen(false);
      }}
    >
      <div
        className="relative w-full max-w-md max-h-[92dvh] flex flex-col bg-[#0b0c0e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto animate-modal-pop text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="orders-title"
      >
        {selectedReceiptOrder ? (
          /* =====================================================================
             DETAILED RECEIPT VIEW (MATCHING ORDER HISTORY DARK THEME)
             ===================================================================== */
          (() => {
            const order = selectedReceiptOrder;
            const createdDate = new Date(order.createdAt);
            const createdMs = createdDate.getTime() || nowMs;
            const updatedMs = new Date(order.statusUpdatedAt).getTime() || createdMs + 14000;
            const isCompleted = order.status === 'completed';
            const elapsedMs = isCompleted
              ? Math.max(1000, updatedMs - createdMs)
              : Math.max(1000, nowMs - createdMs);

            const dayName = createdDate.toLocaleDateString('en-US', { weekday: 'long' });
            const fullDateStr = createdDate.toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            const exactTimeStr = createdDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            const orderTypeLabel =
              order.orderType === 'delivery'
                ? 'Home Delivery'
                : order.orderType === 'pickup'
                  ? 'Self Pickup'
                  : 'Dine-in';

            return (
              <>
                {/* Top Receipt Header */}
                <div className="px-4 py-4 flex items-center justify-between bg-[#0b0c0e] border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedReceiptOrderNum(null)}
                      className="p-1 -ml-1 text-white hover:text-amber-400 rounded-lg transition-colors cursor-pointer"
                      aria-label="Back to Order History"
                    >
                      <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
                    </button>
                    <div>
                      <h2 className="text-base sm:text-lg font-sans font-bold text-white tracking-tight">
                        Order Receipt #{order.orderNumber}
                      </h2>
                      <p className="text-[11px] text-gray-400">
                        {RESTAURANT_INFO.name} · Official Digital Receipt
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-2 bg-[#14161a] hover:bg-[#1c1f26] text-gray-300 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
                    title="Print Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable Receipt Body */}
                <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
                  {/* Live Order Timer & Status Banner */}
                  <div className="bg-[#14161a] border border-white/10 rounded-2xl p-4 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isCompleted ? 'bg-[#1f9d63]' : 'bg-amber-400 animate-ping'
                          }`}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                          {isCompleted ? 'Order Completed' : 'Live Order Timer'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => advanceOrderStatus(order.orderNumber)}
                        title="Click to advance order status"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm cursor-pointer active:scale-95 transition-transform ${
                          isCompleted
                            ? 'bg-[#1f9d63] text-white'
                            : 'bg-amber-500 text-gray-950'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{renderStatusLabel(order.status)}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-[#0b0c0e] border border-white/10 rounded-xl px-3.5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Clock className={`w-5 h-5 ${isCompleted ? 'text-[#1f9d63]' : 'text-amber-400 animate-pulse'}`} />
                        <div>
                          <span className="block text-[11px] text-gray-400">
                            {isCompleted ? 'Total Completion Time' : 'Time Elapsed (Running until completion)'}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {isCompleted
                              ? 'Delivered & Completed'
                              : `Est. Time: ${order.estimatedTime || '35–45 mins'}`}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-lg sm:text-xl font-black text-[#f5c518] tracking-wider">
                        {formatElapsedMMSS(elapsedMs)}
                      </span>
                    </div>

                    {!isCompleted && (
                      <p className="text-[11px] text-gray-400 text-center">
                        Tip: Click the status badge above to simulate order progress to Completed.
                      </p>
                    )}
                  </div>

                  {/* Complete Order Metadata (Kis Din, Kab, Kis Name Se, Address, Payment) */}
                  <div className="bg-[#14161a] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      ORDER &amp; CUSTOMER DETAILS
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#0b0c0e] border border-white/5 space-y-1">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          Day &amp; Date (Kis Din)
                        </span>
                        <p className="font-bold text-white">{dayName}</p>
                        <p className="text-[11px] text-gray-300">{fullDateStr}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0b0c0e] border border-white/5 space-y-1">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Order Time (Kab Kiya)
                        </span>
                        <p className="font-bold text-white">{exactTimeStr}</p>
                        <p className="text-[11px] text-amber-400 font-semibold">{orderTypeLabel}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0b0c0e] border border-white/5 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                          <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          Customer Name:
                        </span>
                        <span className="font-bold text-white text-right">{order.customerName}</span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                          <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          Phone Number:
                        </span>
                        <span className="font-mono font-bold text-white text-right">{order.phoneNumber}</span>
                      </div>

                      <div className="flex items-start justify-between gap-2 pt-1 border-t border-white/5">
                        <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                          <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          Payment Method:
                        </span>
                        <span className="font-bold text-[#f5c518] text-right">
                          {formatPaymentMethodLabel(order.paymentMethod)}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {order.orderType === 'delivery' ? 'Delivery Address & Area:' : 'Location / Branch:'}
                        </span>
                        {order.orderType === 'delivery' ? (
                          <div className="pl-5 space-y-0.5">
                            {order.deliveryAreaName && (
                              <p className="text-xs font-bold text-amber-300">{order.deliveryAreaName}</p>
                            )}
                            <p className="text-xs text-white leading-relaxed">
                              {order.deliveryAddress || 'Address provided at checkout'}
                            </p>
                            {order.deliveryInstructions && (
                              <p className="text-[11px] text-gray-400 italic">
                                Note: "{order.deliveryInstructions}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="pl-5 text-xs text-white">
                            {RESTAURANT_INFO.name} — {RESTAURANT_INFO.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ordered Items Breakdown */}
                  <div className="bg-[#14161a] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      ORDERED ITEMS ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
                    </span>

                    <div className="space-y-3 divide-y divide-white/5">
                      {order.items.map((cartItem) => {
                        const menuMatch = MENU_ITEMS.find((m) => m.id === cartItem.menuItemId);
                        const dishImg =
                          menuMatch?.image || '/src/assets/images/hero_karahi_pot_1790346550068.jpg';

                        return (
                          <div key={cartItem.cartItemId} className="pt-3 first:pt-0 flex items-start gap-3">
                            <img
                              src={dishImg}
                              alt={cartItem.name}
                              className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-[#1d2028] shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-bold text-white leading-snug">
                                  {cartItem.quantity}x {cartItem.name}
                                  {cartItem.selectedSize ? ` (${cartItem.selectedSize})` : ''}
                                </p>
                                <span className="text-sm font-bold text-white shrink-0">
                                  Rs. {cartItem.totalPrice.toLocaleString()}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400">
                                Unit Price: Rs. {cartItem.unitPrice.toLocaleString()}
                              </p>
                              {cartItem.addons && cartItem.addons.length > 0 && (
                                <p className="text-[11px] text-amber-300/90 mt-0.5">
                                  + Add-ons: {cartItem.addons.map((a) => `${a.name} (x${a.quantity})`).join(', ')}
                                </p>
                              )}
                              {cartItem.specialInstructions && (
                                <p className="text-[11px] text-gray-400 italic mt-0.5">
                                  "{cartItem.specialInstructions}"
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-medium">Subtotal</span>
                        <span className="text-white font-semibold">Rs. {order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-medium">Delivery Charges</span>
                        <span className="text-white font-semibold">Rs. {order.deliveryFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-medium">Payment Mode</span>
                        <span className="text-amber-400 font-semibold">
                          {formatPaymentMethodLabel(order.paymentMethod)}
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-2.5 flex items-center justify-between">
                        <span className="text-base font-bold text-white">Total Bill</span>
                        <span className="text-base font-black text-[#f5c518]">
                          Rs. {order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Buttons in Receipt View */}
                  <div className="grid grid-cols-2 gap-3 pb-1">
                    <button
                      type="button"
                      onClick={() => setSelectedReceiptOrderNum(null)}
                      className="py-3 px-4 rounded-xl bg-[#14161a] hover:bg-[#1c1f26] text-white font-bold text-xs sm:text-sm border border-white/15 transition-all text-center cursor-pointer"
                    >
                      Back to Orders
                    </button>
                    <button
                      type="button"
                      onClick={() => reorder(order)}
                      className="py-3 px-4 rounded-xl bg-[#f5c518] hover:bg-[#eab308] text-gray-950 font-bold text-xs sm:text-sm transition-all text-center shadow-md cursor-pointer"
                    >
                      Reorder Same Meal
                    </button>
                  </div>
                </div>
              </>
            );
          })()
        ) : (
          /* =====================================================================
             ORDER HISTORY LIST VIEW (EXACT MATCH TO SCREENSHOT + RECEIPT BUTTON)
             ===================================================================== */
          <>
            {/* Top Bar Matching Screenshot #2: < Order History [Search] */}
            <div className="px-4 py-4 flex items-center justify-between bg-[#0b0c0e] border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsOrdersOpen(false)}
                  className="p-1 -ml-1 text-white hover:text-amber-400 rounded-lg transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
                </button>
                <h2 id="orders-title" className="text-lg sm:text-xl font-sans font-bold text-white tracking-tight">
                  Order History
                </h2>
              </div>

              <button
                onClick={() => setSearchOpen((prev) => !prev)}
                className="p-1.5 text-white hover:text-amber-400 rounded-lg transition-colors cursor-pointer"
                aria-label="Search Orders"
              >
                {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5 stroke-[2.2]" />}
              </button>
            </div>

            {/* Collapsible Search Input */}
            {searchOpen && (
              <div className="px-4 pb-3 bg-[#0b0c0e] border-b border-white/10">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order #, dish, or name..."
                  autoFocus
                  className="w-full px-3.5 py-2 bg-[#14161a] border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Scrollable Order Cards List */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-14 px-4 space-y-3 bg-[#14161a] rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-400 mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-base font-bold text-white">No Orders Found</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Add your favorite Karahi, BBQ, or Handi dishes to your cart to place an order.
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const createdDate = new Date(order.createdAt);
                  const createdMs = createdDate.getTime() || nowMs;
                  const updatedMs = new Date(order.statusUpdatedAt).getTime() || createdMs + 14000;
                  const isCompleted = order.status === 'completed';
                  const elapsedMs = isCompleted
                    ? Math.max(1000, updatedMs - createdMs)
                    : Math.max(1000, nowMs - createdMs);

                  const timeFormatted = createdDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const dateShort = createdDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  });

                  const orderTypeLabel =
                    order.orderType === 'delivery'
                      ? 'Delivery'
                      : order.orderType === 'pickup'
                        ? 'Pickup'
                        : 'Dine-in';

                  return (
                    <div key={order.orderNumber} className="space-y-3">
                      {/* Main Dark Card Matching Screenshot #2 */}
                      <div className="bg-[#14161a] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
                        {/* Top Header Row */}
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                              Order #{order.orderNumber} · {orderTypeLabel}
                            </span>

                            <button
                              type="button"
                              onClick={() => advanceOrderStatus(order.orderNumber)}
                              title="Click to update order status"
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm cursor-pointer active:scale-95 transition-transform ${
                                isCompleted
                                  ? 'bg-[#1f9d63] text-white'
                                  : 'bg-amber-500 text-gray-950'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>{renderStatusLabel(order.status)}</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-1.5">
                            <p className="text-xs text-gray-400">
                              {isCompleted ? (
                                <>Completed in {formatElapsedMMSS(elapsedMs)}</>
                              ) : (
                                <span className="text-amber-400 font-semibold">
                                  Live Timer: {formatElapsedMMSS(elapsedMs)}
                                </span>
                              )}{' '}
                              · {dateShort} · {timeFormatted}
                            </p>

                            {/* Receipt Quick Link */}
                            <button
                              type="button"
                              onClick={() => setSelectedReceiptOrderNum(order.orderNumber)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#f5c518] hover:underline cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Receipt</span>
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-white/10" />

                        {/* ITEMS Section */}
                        <div className="space-y-3">
                          <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            ITEMS
                          </span>

                          <div className="space-y-3">
                            {order.items.map((cartItem) => {
                              const menuMatch = MENU_ITEMS.find((m) => m.id === cartItem.menuItemId);
                              const dishImg =
                                menuMatch?.image || '/src/assets/images/hero_karahi_pot_1790346550068.jpg';

                              return (
                                <div key={cartItem.cartItemId} className="flex items-center gap-3">
                                  <img
                                    src={dishImg}
                                    alt={cartItem.name}
                                    className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-[#1d2028] shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-white leading-snug">
                                      {cartItem.quantity}x {cartItem.name}
                                      {cartItem.selectedSize ? ` (${cartItem.selectedSize})` : ''}
                                    </p>
                                    <p className="text-sm font-bold text-white mt-0.5">
                                      Rs. {cartItem.totalPrice.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="border-t border-white/10" />

                        {/* CUSTOMER Section */}
                        <div className="space-y-1">
                          <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            CUSTOMER
                          </span>
                          <p className="text-sm font-bold text-white pt-0.5">{order.customerName}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{order.phoneNumber}</span>
                          </p>
                          {order.deliveryAddress && (
                            <p className="text-xs text-gray-400 flex items-start gap-1.5 pt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">
                                {order.deliveryAreaName ? `${order.deliveryAreaName} — ` : ''}
                                {order.deliveryAddress}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="border-t border-white/10" />

                        {/* BILL DETAILS Section */}
                        <div className="space-y-2.5">
                          <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            BILL DETAILS
                          </span>

                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-semibold text-white">Subtotal</span>
                            <span className="text-gray-400 font-medium">
                              Rs. {order.subtotal.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-semibold text-white">Delivery Fee</span>
                            <span className="text-gray-400 font-medium">
                              Rs. {order.deliveryFee.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-semibold text-white">Payment</span>
                            <span className="text-gray-400 font-medium">
                              {formatPaymentMethodLabel(order.paymentMethod)}
                            </span>
                          </div>

                          <div className="border-t border-white/10 pt-2.5 flex items-center justify-between">
                            <span className="text-sm sm:text-base font-bold text-white">Total Bill</span>
                            <span className="text-sm sm:text-base font-bold text-white">
                              Rs. {order.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom 3 Action Buttons: Reorder (Yellow), View Receipt, & Rate Order */}
                      <div className="grid grid-cols-3 gap-2.5">
                        <button
                          type="button"
                          onClick={() => reorder(order)}
                          className="py-3 px-3 rounded-xl bg-[#f5c518] hover:bg-[#eab308] active:scale-95 text-gray-950 font-bold text-xs sm:text-sm transition-all text-center shadow-md cursor-pointer"
                        >
                          Reorder
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedReceiptOrderNum(order.orderNumber)}
                          className="py-3 px-3 rounded-xl bg-[#14161a] hover:bg-[#1c1f26] active:scale-95 text-[#f5c518] font-bold text-xs sm:text-sm border border-[#f5c518]/40 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span>Receipt</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsOrdersOpen(false);
                            setReviewingOrder(order);
                          }}
                          className="py-3 px-3 rounded-xl bg-[#14161a] hover:bg-[#1c1f26] active:scale-95 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all text-center cursor-pointer"
                        >
                          Rate Order
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
