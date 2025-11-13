import { signal, computed } from '@angular/core';
import { CartItem, MenuItem } from './types';
import { menuService } from './menu.service';

/**
 * Service for managing shopping cart operations
 */
export class CartService {
  /** Items currently in the cart */
  private cartItemsSignal = signal<CartItem[]>([]);

  /** Public getter for cart items */
  cartItems = this.cartItemsSignal.asReadonly();

  /** Total number of items in cart */
  cartItemCount = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => total + item.quantity, 0);
  });

  /** Subtotal before discounts */
  cartSubtotal = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  /** Number of main courses in cart */
  mainCoursesCount = computed(() => {
    return this.cartItemsSignal().filter(item => item.course === 'Mains').reduce((total, item) => total + item.quantity, 0);
  });

  /** Special discount amount (R50 off for every 2 mains) */
  specialDiscountAmount = computed(() => {
    const mainsCount = this.mainCoursesCount();
    return Math.floor(mainsCount / 2) * 50;
  });

  /** Total discount applied */
  specialDiscount = computed(() => {
    return this.specialDiscountAmount();
  });

  /** Final total after discounts */
  cartTotal = computed(() => {
    return this.cartSubtotal() - this.specialDiscount();
  });

  /** Add item to cart */
  addToCart(item: MenuItem): boolean {
    if (!item.available) {
      return false;
    }

    const currentCart = this.cartItemsSignal();
    const existingItem = currentCart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      this.updateCartQuantity(item.id, existingItem.quantity + 1);
    } else {
      this.cartItemsSignal.set([...currentCart, { ...item, quantity: 1 }]);
    }
    return true;
  }

  /** Update quantity of item in cart */
  updateCartQuantity(itemId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.cartItemsSignal.set(this.cartItemsSignal().filter(item => item.id !== itemId));
      return;
    }
    this.cartItemsSignal.set(
      this.cartItemsSignal().map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  /** Get quantity of specific item in cart */
  getItemQuantity(itemId: number): number {
    const item = this.cartItemsSignal().find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  }

  /** Clear entire cart */
  clearCart(): void {
    this.cartItemsSignal.set([]);
  }

  /** Remove item from cart when it's marked unavailable */
  removeUnavailableItem(itemId: number): void {
    this.cartItemsSignal.set(this.cartItemsSignal().filter(item => item.id !== itemId));
  }
}

// Global instance
export const cartService = new CartService();
