/**
 * Define the possible courses for menu items.
 */
export type Course = 'Mains' | 'Starters' | 'Desserts' | 'Drinks';

/**
 * Define the structure for a single menu item.
 */
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  course: Course;
  price: number;
  image: string;
  available: boolean; // Stock control
}

/**
 * Defines the structure for an item currently in the user's cart.
 */
export interface CartItem extends MenuItem {
  quantity: number;
}

/**
 * Page identifiers for navigation
 */
export type Page = 'welcome' | 'customer-setup' | 'home' | 'cart' | 'chef-login' | 'payment-options' | 'card-payment' | 'cash-payment' | 'confirmation' | 'chef' | 'settings' | 'menu-management' | 'filter-menu';

/**
 * Payment method types
 */
export type PaymentMethod = 'Card' | 'Cash' | 'Voucher';

/**
 * Average price data structure
 */
export interface AveragePriceData {
  course: Course;
  average: number;
  count: number;
}
