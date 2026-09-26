import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  BookingOccasion,
  CartItem,
  CustomerOrder,
  CustomerReview,
  MenuItem,
  OrderStatus,
  OrderType,
  PaymentMethod,
  RestaurantPost,
  SeatingPreference,
  SelectedAddon,
  TableBooking,
  TableSeatAllocation,
} from '../types/restaurant';
import { DELIVERY_AREAS, MENU_ITEMS } from '../data/restaurantData';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  instructions: string;
}

interface RestaurantContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Cart
  cart: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedAreaId: string;
  setSelectedAreaId: (id: string) => void;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  cartItemCount: number;
  estimatedTime: string;
  addToCart: (
    item: MenuItem,
    selectedSizeName: string | undefined,
    addons: SelectedAddon[],
    specialInstructions: string,
    quantity: number
  ) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Orders
  orders: CustomerOrder[];
  placeOrder: (info: {
    customerName: string;
    phoneNumber: string;
    deliveryAddress?: string;
    deliveryInstructions?: string;
    bookingDate?: string;
    bookingTime?: string;
    guestsCount?: number;
  }) => CustomerOrder;
  reorder: (order: CustomerOrder) => void;
  advanceOrderStatus: (orderNumber: string) => void;
  markOrderCompleted: (orderNumber: string) => void;

  // Bookings
  bookings: TableBooking[];
  createBooking: (info: {
    customerName: string;
    phoneNumber: string;
    date: string;
    arrivalTime: string;
    guests: number;
    tableCount?: number;
    tableAllocations?: TableSeatAllocation[];
    seatingPreference?: SeatingPreference;
    occasion?: BookingOccasion;
    specialRequest?: string;
  }) => TableBooking;
  advanceBookingStatus: (bookingNumber: string) => void;

  // Reviews
  reviews: CustomerReview[];
  submitReview: (orderNumber: string, rating: number, comment: string, customerName: string) => boolean;

  // Posts & Updates
  posts: RestaurantPost[];
  addPost: (post: { title: string; content: string; category: RestaurantPost['category'] }) => void;
  deletePost: (id: string) => void;

  // Saved customer details
  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;

  // UI state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrdersOpen: boolean;
  setIsOrdersOpen: (open: boolean) => void;
  isBookingsOpen: boolean;
  setIsBookingsOpen: (open: boolean) => void;
  isTableReservationModalOpen: boolean;
  setIsTableReservationModalOpen: (open: boolean) => void;
  isUpdatesModalOpen: boolean;
  setIsUpdatesModalOpen: (open: boolean) => void;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (open: boolean) => void;
  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;
  activeConfirmationOrder: CustomerOrder | null;
  setActiveConfirmationOrder: (order: CustomerOrder | null) => void;
  reviewingOrder: CustomerOrder | null;
  setReviewingOrder: (order: CustomerOrder | null) => void;
  cartBump: boolean;
  addedItemToast: string | null;
  socialToast: string | null;
  triggerSocialToast: (msg: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

const STORAGE_KEYS = {
  THEME: 'al_jannat_theme_v1',
  CART: 'al_jannat_cart_v1',
  ORDER_TYPE: 'al_jannat_order_type_v1',
  AREA_ID: 'al_jannat_area_id_v1',
  CUSTOMER_INFO: 'al_jannat_customer_info_v1',
  ORDERS: 'al_jannat_orders_v1',
  ORDER_COUNTER: 'al_jannat_order_counter_v1',
  BOOKINGS: 'al_jannat_bookings_v1',
  BOOKING_COUNTER: 'al_jannat_booking_counter_v1',
  FAVORITES: 'al_jannat_favorites_v1',
  REVIEWS: 'al_jannat_reviews_v1',
  POSTS: 'sandh_posts_updates_v1',
};

const DEFAULT_POSTS: RestaurantPost[] = [
  {
    id: 'post_1',
    title: 'Admin Panel, Rider Panel & Complete Website Package',
    content:
      'Admin panel se post kr sakte ha ya demo version ha dekhna ke lya ha apko website puri chye jis ke saath admin panel rider panel or bhi alag option jo hote ha wo milenge alag milenge.',
    category: 'Update',
    createdAt: new Date().toISOString(),
    author: 'Admin Notice',
  },
  {
    id: 'post_2',
    title: 'Daily Operating Hours: 12 PM–12 AM',
    content:
      'Sandh Restaurant welcomes guests every day from 12 PM to 12 AM for Indoor, Outdoor, Rooftop, and Family Hall dining as well as online delivery and takeaway.',
    category: 'Update',
    createdAt: new Date().toISOString(),
    author: 'Sandh Management',
  },
];

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: defaults to dark per user request and Image 2 design
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return (saved as 'light' | 'dark') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderType, setOrderType] = useState<OrderType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDER_TYPE);
      return (saved as OrderType) || 'delivery';
    } catch {
      return 'delivery';
    }
  });

  const [selectedAreaId, setSelectedAreaId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AREA_ID);
      return saved || 'gulshan_iqbal';
    } catch {
      return 'gulshan_iqbal';
    }
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER_INFO);
      return saved ? JSON.parse(saved) : { name: '', phone: '', address: '', instructions: '' };
    } catch {
      return { name: '', phone: '', address: '', instructions: '' };
    }
  });

  // Orders
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderCounter, setOrderCounter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDER_COUNTER);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Bookings
  const [bookings, setBookings] = useState<TableBooking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookingCounter, setBookingCounter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKING_COUNTER);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['chicken_karahi', 'special_chicken_biryani'];
    } catch {
      return ['chicken_karahi', 'special_chicken_biryani'];
    }
  });

  // Reviews
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Posts & Updates
  const [posts, setPosts] = useState<RestaurantPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : DEFAULT_POSTS;
    } catch {
      return DEFAULT_POSTS;
    }
  });

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isTableReservationModalOpen, setIsTableReservationModalOpen] = useState(false);
  const [isUpdatesModalOpen, setIsUpdatesModalOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [activeConfirmationOrder, setActiveConfirmationOrder] = useState<CustomerOrder | null>(null);
  const [reviewingOrder, setReviewingOrder] = useState<CustomerOrder | null>(null);
  const [cartBump, setCartBump] = useState(false);
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null);
  const [socialToast, setSocialToast] = useState<string | null>(null);

  const triggerSocialToast = (msg: string) => {
    setSocialToast(msg);
    setTimeout(() => {
      setSocialToast((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Lock background body scroll when any modal or drawer is open (prevents background scroll bleed & double scrollbars)
  const isAnyModalOpen =
    isCartOpen ||
    isCheckoutOpen ||
    isOrdersOpen ||
    isBookingsOpen ||
    isTableReservationModalOpen ||
    isUpdatesModalOpen ||
    isFavoritesOpen ||
    !!customizingItem ||
    !!activeConfirmationOrder ||
    !!reviewingOrder;

  useEffect(() => {
    if (isAnyModalOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isAnyModalOpen]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDER_TYPE, orderType);
  }, [orderType]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AREA_ID, selectedAreaId);
  }, [selectedAreaId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_INFO, JSON.stringify(customerInfo));
  }, [customerInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDER_COUNTER, orderCounter.toString());
  }, [orderCounter]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKING_COUNTER, bookingCounter.toString());
  }, [bookingCounter]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  // Calculations
  const selectedArea = DELIVERY_AREAS.find((a) => a.id === selectedAreaId) || DELIVERY_AREAS[0];

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  const deliveryFee = orderType === 'delivery' ? (cart.length > 0 ? selectedArea.fee : 0) : 0;
  const cartTotal = cartSubtotal + deliveryFee;
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const estimatedTime =
    orderType === 'delivery'
      ? selectedArea.estimatedTime
      : orderType === 'pickup'
      ? '20–30 min'
      : 'At Scheduled Arrival';

  // Cart operations
  const addToCart = (
    item: MenuItem,
    selectedSizeName: string | undefined,
    addons: SelectedAddon[],
    specialInstructions: string,
    quantity: number
  ) => {
    let unitPrice = item.basePrice;
    if (selectedSizeName && item.sizes) {
      const matched = item.sizes.find((s) => s.name === selectedSizeName);
      if (matched) unitPrice = matched.price;
    }

    const addonsTotal = addons.reduce((sum, a) => sum + a.price * a.quantity, 0);
    const itemTotalPrice = (unitPrice + addonsTotal) * quantity;

    // Build a unique key based on item, size, addons, instructions
    const addonsKey = addons
      .filter((a) => a.quantity > 0)
      .map((a) => `${a.addonId}:${a.quantity}`)
      .sort()
      .join('|');
    const signature = `${item.id}_${selectedSizeName || 'default'}_${addonsKey}_${specialInstructions.trim()}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.cartItemId === signature);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: (existing.unitPrice + addonsTotal) * newQty,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: signature,
          menuItemId: item.id,
          name: item.name,
          selectedSize: selectedSizeName,
          unitPrice,
          quantity,
          addons: addons.filter((a) => a.quantity > 0),
          specialInstructions: specialInstructions.trim(),
          totalPrice: itemTotalPrice,
        };
        return [...prev, newItem];
      }
    });

    // Visual feedback: bump cart button and show toast
    setCartBump(true);
    setAddedItemToast(item.name);
    setTimeout(() => setCartBump(false), 700);
    setTimeout(() => setAddedItemToast(null), 2400);
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const is70 = item.unitPrice === 70;
            if (is70 && delta < 0 && item.quantity <= 4) {
              return null; // Remove item if decreasing below minimum 4
            }
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const addonsSum = item.addons.reduce((sum, a) => sum + a.price * a.quantity, 0);
            return {
              ...item,
              quantity: newQty,
              totalPrice: (item.unitPrice + addonsSum) * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Favorites
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  // Orders
  const placeOrder = (info: {
    customerName: string;
    phoneNumber: string;
    deliveryAddress?: string;
    deliveryInstructions?: string;
    bookingDate?: string;
    bookingTime?: string;
    guestsCount?: number;
  }): CustomerOrder => {
    // Generate sequential padded order number starting from 000001
    const orderNumberStr = String(orderCounter).padStart(6, '0');
    setOrderCounter((prev) => prev + 1);

    const paymentMethod: PaymentMethod =
      orderType === 'delivery'
        ? 'cash_on_delivery'
        : orderType === 'pickup'
        ? 'payment_at_pickup'
        : 'pay_at_restaurant';

    const orderEstimatedTime =
      orderType === 'dinein' && info.bookingTime
        ? `${info.bookingTime} (${info.bookingDate || 'Today'})`
        : estimatedTime;

    const newOrder: CustomerOrder = {
      orderNumber: orderNumberStr,
      createdAt: new Date().toISOString(),
      orderType,
      customerName: info.customerName,
      phoneNumber: info.phoneNumber,
      deliveryAreaId: orderType === 'delivery' ? selectedArea.id : undefined,
      deliveryAreaName: orderType === 'delivery' ? selectedArea.name : undefined,
      deliveryAddress: orderType === 'delivery' ? info.deliveryAddress : undefined,
      deliveryInstructions: orderType === 'delivery' ? info.deliveryInstructions : undefined,
      bookingDate: info.bookingDate,
      bookingTime: info.bookingTime,
      guestsCount: info.guestsCount,
      paymentMethod,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: deliveryFee,
      total: cartTotal,
      estimatedTime: orderEstimatedTime,
      status: 'order_received',
      statusUpdatedAt: new Date().toISOString(),
      hasReview: false,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveConfirmationOrder(newOrder);

    // Save customer info for ease of next use
    setCustomerInfo((prev) => ({
      ...prev,
      name: info.customerName,
      phone: info.phoneNumber,
      address: info.deliveryAddress || prev.address,
      instructions: info.deliveryInstructions || prev.instructions,
    }));

    return newOrder;
  };

  const advanceOrderStatus = (orderNumber: string) => {
    const statusProgression: OrderStatus[] = [
      'order_received',
      'confirmed',
      'preparing',
      'out_for_delivery',
      'completed',
    ];

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderNumber === orderNumber) {
          const currentIndex = statusProgression.indexOf(ord.status);
          const nextIndex = Math.min(currentIndex + 1, statusProgression.length - 1);
          const updated = {
            ...ord,
            status: statusProgression[nextIndex],
            statusUpdatedAt: new Date().toISOString(),
          };
          if (activeConfirmationOrder?.orderNumber === orderNumber) {
            setActiveConfirmationOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );
  };

  const markOrderCompleted = (orderNumber: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderNumber === orderNumber) {
          const updated: CustomerOrder = {
            ...ord,
            status: 'completed',
            statusUpdatedAt: new Date().toISOString(),
          };
          if (activeConfirmationOrder?.orderNumber === orderNumber) {
            setActiveConfirmationOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );
  };

  const reorder = (order: CustomerOrder) => {
    // Add all items from the previous order back to cart
    setCart((prev) => {
      const merged = [...prev];
      order.items.forEach((item) => {
        const existingIndex = merged.findIndex((ci) => ci.cartItemId === item.cartItemId);
        if (existingIndex > -1) {
          const existing = merged[existingIndex];
          const newQty = existing.quantity + item.quantity;
          const addonsSum = item.addons.reduce((sum, a) => sum + a.price * a.quantity, 0);
          merged[existingIndex] = {
            ...existing,
            quantity: newQty,
            totalPrice: (existing.unitPrice + addonsSum) * newQty,
          };
        } else {
          merged.push({ ...item });
        }
      });
      return merged;
    });

    if (order.orderType) {
      setOrderType(order.orderType);
    }
    if (order.deliveryAreaId) {
      setSelectedAreaId(order.deliveryAreaId);
    }

    setIsOrdersOpen(false);
    setIsCartOpen(true);
  };

  // Bookings
  const createBooking = (info: {
    customerName: string;
    phoneNumber: string;
    date: string;
    arrivalTime: string;
    guests: number;
    tableCount?: number;
    tableAllocations?: TableSeatAllocation[];
    seatingPreference?: SeatingPreference;
    occasion?: BookingOccasion;
    specialRequest?: string;
  }): TableBooking => {
    const bookingNumberStr = `B${String(bookingCounter).padStart(6, '0')}`;
    setBookingCounter((prev) => prev + 1);

    const newBooking: TableBooking = {
      bookingNumber: bookingNumberStr,
      createdAt: new Date().toISOString(),
      customerName: info.customerName,
      phoneNumber: info.phoneNumber,
      date: info.date,
      arrivalTime: info.arrivalTime,
      guests: info.guests,
      tableCount: info.tableCount || 1,
      tableAllocations: info.tableAllocations || [{ tableNumber: 1, guests: info.guests }],
      seatingPreference: info.seatingPreference || 'Indoor',
      occasion: info.occasion || '',
      specialRequest: info.specialRequest,
      status: 'pending_confirmation',
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Save info
    setCustomerInfo((prev) => ({
      ...prev,
      name: info.customerName,
      phone: info.phoneNumber,
    }));

    return newBooking;
  };

  const advanceBookingStatus = (bookingNumber: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingNumber === bookingNumber) {
          return {
            ...b,
            status: b.status === 'pending_confirmation' ? 'confirmed' : 'pending_confirmation',
          };
        }
        return b;
      })
    );
  };

  // Posts & Updates
  const addPost = (post: { title: string; content: string; category: RestaurantPost['category'] }) => {
    const newPost: RestaurantPost = {
      id: `post_${Date.now()}`,
      title: post.title,
      content: post.content,
      category: post.category,
      createdAt: new Date().toISOString(),
      author: 'Sandh Restaurant',
    };
    setPosts((prev) => [newPost, ...prev]);
    triggerSocialToast('New update/post published successfully!');
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Reviews
  const submitReview = (
    orderNumber: string,
    rating: number,
    comment: string,
    customerName: string
  ): boolean => {
    const targetOrder = orders.find((o) => o.orderNumber === orderNumber);
    if (!targetOrder || targetOrder.status !== 'completed') {
      return false;
    }

    const newReview: CustomerReview = {
      id: `rev_${Date.now()}`,
      orderNumber,
      customerName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      verifiedOrder: true,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Mark order as reviewed
    setOrders((prev) =>
      prev.map((ord) => (ord.orderNumber === orderNumber ? { ...ord, hasReview: true } : ord))
    );

    return true;
  };

  return (
    <RestaurantContext.Provider
      value={{
        theme,
        toggleTheme,

        cart,
        orderType,
        setOrderType,
        selectedAreaId,
        setSelectedAreaId,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        cartItemCount,
        estimatedTime,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,

        favorites,
        toggleFavorite,
        isFavorite,

        orders,
        placeOrder,
        reorder,
        advanceOrderStatus,
        markOrderCompleted,

        bookings,
        createBooking,
        advanceBookingStatus,

        reviews,
        submitReview,

        posts,
        addPost,
        deletePost,

        customerInfo,
        setCustomerInfo,

        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        isBookingsOpen,
        setIsBookingsOpen,
        isTableReservationModalOpen,
        setIsTableReservationModalOpen,
        isUpdatesModalOpen,
        setIsUpdatesModalOpen,
        isFavoritesOpen,
        setIsFavoritesOpen,
        customizingItem,
        setCustomizingItem,
        activeConfirmationOrder,
        setActiveConfirmationOrder,
        reviewingOrder,
        setReviewingOrder,
        cartBump,
        addedItemToast,
        socialToast,
        triggerSocialToast,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
