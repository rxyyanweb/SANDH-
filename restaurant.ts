export type CategoryId =
  | 'bbq'
  | 'karahi'
  | 'handi'
  | 'rice'
  | 'tandoor'
  | 'salads_raita'
  | 'drinks'
  | 'desserts';

export interface MenuAddon {
  id: string;
  name: string;
  price: number;
  category?: 'addon' | 'bread' | 'raita';
}

export interface MenuSizeOption {
  name: string;
  price: number;
  serves?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: CategoryId;
  description: string;
  basePrice: number;
  image?: string;
  sizes?: MenuSizeOption[];
  availableAddons?: MenuAddon[];
  spicyLevel?: 0 | 1 | 2 | 3;
  popular?: boolean;
}

export interface SelectedAddon {
  addonId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  cartItemId: string; // unique per configuration
  menuItemId: string;
  name: string;
  selectedSize?: string;
  unitPrice: number; // base size price
  quantity: number;
  addons: SelectedAddon[];
  specialInstructions?: string;
  totalPrice: number; // (unitPrice + sum(addons)) * quantity
}

export type OrderType = 'delivery' | 'pickup' | 'dinein';

export type PaymentMethod = 'cash_on_delivery' | 'payment_at_pickup' | 'pay_at_restaurant';

export type OrderStatus =
  | 'order_received'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'completed';

export interface DeliveryArea {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
}

export interface CustomerOrder {
  orderNumber: string; // e.g. "000001"
  createdAt: string;
  orderType: OrderType;
  customerName: string;
  phoneNumber: string;
  deliveryAreaId?: string;
  deliveryAreaName?: string;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  bookingDate?: string;
  bookingTime?: string;
  guestsCount?: number;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedTime: string;
  status: OrderStatus;
  statusUpdatedAt: string;
  hasReview?: boolean;
}

export type BookingStatus = 'pending_confirmation' | 'confirmed' | 'cancelled';

export type SeatingPreference = 'Indoor' | 'Outdoor' | 'Rooftop' | 'Family Hall';

export type BookingOccasion = 'Birthday' | 'Anniversary' | 'Business Meeting' | 'Casual' | '';

export interface TableSeatAllocation {
  tableNumber: number;
  guests: number;
}

export interface TableBooking {
  bookingNumber: string; // e.g. "B000001"
  createdAt: string;
  customerName: string;
  phoneNumber: string;
  date: string; // YYYY-MM-DD
  arrivalTime: string; // e.g. "07:30 PM"
  guests: number;
  tableCount?: number;
  tableAllocations?: TableSeatAllocation[];
  seatingPreference?: SeatingPreference;
  occasion?: BookingOccasion;
  specialRequest?: string;
  status: BookingStatus;
}

export interface CustomerReview {
  id: string;
  orderNumber: string;
  customerName: string;
  rating: number; // 1 - 5
  comment: string;
  createdAt: string;
  verifiedOrder: boolean;
}

export interface RestaurantPost {
  id: string;
  title: string;
  content: string;
  category: 'Update' | 'Notice' | 'Special Offer' | 'Alert';
  createdAt: string;
  author?: string;
}
