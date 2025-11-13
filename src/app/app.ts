import { ChangeDetectionStrategy, Component, computed, signal, Signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Course, MenuItem, CartItem, Page, PaymentMethod, AveragePriceData } from './types';
import { menuService } from './menu.service';
import { cartService } from './cart.service';
import { calculateAveragePrices, validateCustomerSetup, validateCardPayment, generateOrderNumber, formatCurrency } from './utils';

// =================================================================
// Image Mappings (Updated with real food images)
// =================================================================
const imageMap: { [key: string]: string } = {
  'Rib King Ribs': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=150&fit=crop',
  'Caesar Salad': 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=150&fit=crop',
  'Chocolate Lava Cake': 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=150&fit=crop',
  'Fresh Orange Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=150&fit=crop',
  'Grilled Salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=150&fit=crop',
  'Garlic Breadsticks': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=150&fit=crop',
  'Burger Deluxe': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=150&fit=crop'
};

// =================================================================
// 2. Component Definition
// =================================================================

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Custom Alert Modal -->
    @if (alertMessage()) {
      <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div class="bg-white text-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full">
          <h3 class="text-xl font-bold mb-3">Notice</h3>
          <p class="mb-4">{{ alertMessage() }}</p>
          <button (click)="alertMessage.set(null)" class="main-button w-full py-2 rounded-lg">OK</button>
        </div>
      </div>
    }

    <div id="app-container" class="app-container">
      <!-- App Header for Menu and Cart Views -->
      @if (currentPage() === 'home' || currentPage() === 'cart' || currentPage() === 'settings') {
          <header class="p-4 flex justify-between items-center card rounded-xl mb-4 sticky top-0 z-10">
              <h1 class="text-2xl font-bold">Atero Menu</h1>
              <div class="flex space-x-3">
                  <!-- Settings Icon -->
                  <button (click)="navigateTo('settings')" class="p-2 card rounded-full hover:bg-gray-700 transition text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18A2 2 0 0 1 9 6c0 .48-.1.9-.29 1.28l-.05.15a2 2 0 0 0-1.28 2.22l.14.49A2 2 0 0 1 5.18 10h-.18a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2h.18a2 2 0 0 1 1.76 1.15l.05.15c.19.38.29.8.29 1.28a2 2 0 0 0 1.15 1.76l.49.14A2 2 0 0 1 10 21.82v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1.76-1.15l.05-.15c.19-.38.29-.8.29-1.28a2 2 0 0 0 1.15-1.76l.14-.49A2 2 0 0 1 21.82 14h.18a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2h-.18a2 2 0 0 1-1.76-1.15l-.05-.15a2 2 0 0 0-1.28-2.22l-.14-.49A2 2 0 0 1 14 2.18V2a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <!-- Shopping Cart Icon -->
                  <button (click)="navigateTo('cart')" class="relative p-2 card rounded-full hover:bg-gray-700 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 12.44a2 2 0 0 0 2 1.56h9.72a2 2 0 0 0 2-1.56L23 6H6"></path></svg>
                      @if (cartItemCount() > 0) {
                          <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black transform translate-x-1/2 -translate-y-1/2 bg-primary-color rounded-full">{{ cartItemCount() }}</span>
                      }
                  </button>
                  <button (click)="handleLogout()" class="text-sm text-primary-color hover:underline">Logout</button>
              </div>
          </header>
      }

      @switch (currentPage()) {
        @case ('welcome') {
          <!-- WELCOME SCREEN -->
          <div class="h-screen flex flex-col justify-center items-center p-8 text-center bg-gray-900">
              <svg class="text-primary-color mb-4" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H9a1 1 0 0 0-1 1v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V3a1 1 0 0 0-1-1z"></path><path d="M18 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1"></path><path d="M6 10H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1"></path></svg>
              <h1 class="text-5xl font-extrabold text-white mb-3">Atero Eats</h1>
              <p class="text-xl text-gray-400 mb-10">Digital Ordering Made Simple</p>

              <div class="space-y-4 w-full max-w-xs">
                  <button (click)="navigateTo('customer-setup')" class="main-button w-full py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-red-400 transition transform hover:scale-[1.02]">
                      Start Your Order
                  </button>
                  <button (click)="navigateTo('chef-login')" class="card w-full py-4 rounded-xl text-lg font-semibold text-primary-color shadow-lg hover:bg-gray-700 transition">
                      Staff / Admin Login
                  </button>
              </div>
          </div>
        }
        @case ('customer-setup') {
            <!-- CUSTOMER SETUP SCREEN -->
            <div class="h-screen flex flex-col justify-center items-center p-8 text-center">
                <h1 class="text-3xl font-bold text-white mb-4">Customer Setup</h1>
                <p class="text-gray-400 mb-8">
                    Tell us your name and table number to begin.
                </p>

                <div class="w-full max-w-sm">
                    <input #nameInput type="text" placeholder="Your Name" class="w-full card p-4 rounded-xl mb-4 text-white focus:ring-primary-color focus:ring-2 border-none">
                    <input #tableInput type="number" placeholder="Table Number (e.g., 5)" class="w-full card p-4 rounded-xl mb-6 text-white focus:ring-primary-color focus:ring-2 border-none">

                    <button (click)="handleCustomerSetup(nameInput.value, tableInput.value)" class="main-button w-full py-3 px-6 rounded-xl font-semibold text-lg hover:bg-red-400 transition">
                        View Menu
                    </button>
                    <button (click)="navigateTo('welcome')" class="mt-4 text-sm text-gray-500 hover:underline">
                        Back to Welcome Screen
                    </button>
                </div>
            </div>
        }
        @case ('home') {
          <!-- Display Customer/Table Info -->
          @if (userName() !== 'Guest') {
            <div class="p-4 card rounded-xl mb-4">
              <p class="text-gray-300 text-sm">Welcome, <span class="text-primary-color font-semibold">{{ userName() }}</span>! Your order will be sent to Table <span class="text-primary-color font-semibold">#{{ tableNumber() }}</span>.</p>
            </div>
          }

          <!-- Special Offer Band -->
          <div class="bg-yellow-600 text-black p-3 rounded-xl font-bold text-center mb-6 shadow-md animate-pulse">
             ✨ CHEF'S SPECIAL: Buy 2 Mains, get R{{ specialDiscountAmount() | number:'1.0-0' }} OFF your order! ✨
          </div>

          <!-- Menu Filtering Buttons -->
          <div class="flex justify-between space-x-2 mb-6">
              <button (click)="setFilter('All')" class="flex-1 py-2 rounded-lg text-sm transition" [class]="currentFilter() === 'All' ? 'main-button font-bold' : 'card hover:bg-gray-700'">All</button>
            @for (course of courses; track course) {
              <button (click)="setFilter(course)" class="flex-1 py-2 rounded-lg text-sm transition" [class]="currentFilter() === course ? 'main-button font-bold' : 'card hover:bg-gray-700'">
                  {{ course }}
              </button>
            }
          </div>

          <!-- Menu Display -->
          @if (menuItemsForView().length === 0) {
            <p class="text-center text-gray-400 mt-10">No items found in this category.</p>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (item of menuItemsForView(); track item.id) {
                <div [class.opacity-50]="!item.available"
                     [class.item-flash]="recentlyAddedId() === item.id"
                     class="card p-4 rounded-xl shadow-lg flex flex-col transition duration-300">
                    <div class="h-32 w-full mb-3 rounded-lg overflow-hidden">
                        <img [src]="item.image" [alt]="item.name" class="object-cover w-full h-full">
                    </div>
                    <h3 class="text-xl font-semibold mb-1">{{ item.name }}</h3>
                    <p class="text-sm text-gray-300 mb-2 h-10 overflow-hidden">{{ item.description }}</p>
                    <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-600">
                        <span class="text-primary-color font-bold">R {{ item.price | number:'1.2-2' }}</span>
                        @if (item.available) {
                            <!-- Check if item is already in cart -->
                            @if (getItemQuantity(item.id) > 0) {
                                <div class="flex items-center space-x-2">
                                    <span class="text-white font-bold px-2 py-1 rounded-lg bg-green-600 text-sm shadow-md">
                                        {{ getItemQuantity(item.id) }} Added
                                    </span>
                                    <button (click)="addToCart(item)" class="main-button px-3 py-1 rounded-lg text-sm hover:bg-red-400 transition">
                                        + Add More
                                    </button>
                                </div>
                            } @else {
                                <button (click)="addToCart(item)" class="main-button px-3 py-1 rounded-lg text-sm hover:bg-red-400 transition">
                                    Add to Cart
                                </button>
                            }
                        } @else {
                          <span class="text-red-400 font-bold text-sm bg-gray-700 px-3 py-1 rounded-lg">SOLD OUT</span>
                        }
                    </div>
                </div>
              }
            </div>
          }
        }
        @case ('cart') {
          <!-- Cart View -->
          <h1 class="text-2xl font-bold mb-4 mt-2">Your Order</h1>

          @if (cartItems().length === 0) {
            <div class="text-center mt-20 p-8 card rounded-xl">
              <p class="text-gray-400 text-lg">Your cart is empty. Time to order some delicious food!</p>
              <button (click)="navigateTo('home')" class="main-button mt-4 py-2 px-4 rounded-lg">View Menu</button>
            </div>
          } @else {
            <!-- Cart Items List -->
            <div class="space-y-3 mb-6">
              @for (item of cartItems(); track item.id) {
                <div class="card p-4 rounded-xl flex items-center">
                  <img [src]="item.image" [alt]="item.name" class="w-16 h-16 rounded-lg mr-4 object-cover">
                  <div class="flex-1">
                    <h4 class="font-semibold">{{ item.name }}</h4>
                    <span class="text-sm text-primary-color">R {{ item.price * item.quantity | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button (click)="updateCartQuantity(item.id, item.quantity - 1)"
                            class="card w-8 h-8 rounded-full text-xl leading-none hover:bg-gray-600">-</button>
                    <span class="w-6 text-center font-bold">{{ item.quantity }}</span>
                    <button (click)="updateCartQuantity(item.id, item.quantity + 1)"
                            class="main-button w-8 h-8 rounded-full text-xl leading-none hover:bg-red-400">+</button>
                  </div>
                </div>
              }
            </div>

            <!-- Cart Summary -->
            <div class="card p-5 rounded-xl space-y-2 mb-6">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span class="font-semibold">R {{ cartSubtotal() | number:'1.2-2' }}</span>
              </div>
              @if (specialDiscount() > 0) {
                <div class="flex justify-between text-yellow-400">
                  <span>Special Discount:</span>
                  <span class="font-semibold">- R {{ specialDiscount() | number:'1.2-2' }}</span>
                </div>
              }
              <div class="flex justify-between border-t border-gray-600 pt-2 text-xl">
                <span class="font-bold">Total:</span>
                <span class="font-bold text-primary-color">R {{ cartTotal() | number:'1.2-2' }}</span>
              </div>
            </div>

            <!-- Checkout Button -->
            <button (click)="navigateTo('payment-options')" class="main-button w-full py-3 rounded-lg font-semibold text-lg hover:bg-red-400 transition">
              Proceed to Payment
            </button>
          }
        }
        @case ('chef-login') {
            <div class="h-screen flex flex-col justify-center items-center p-8 text-center">
                <h1 class="text-3xl font-bold text-white mb-10">Chef Admin Login</h1>
                <input #chefPassword type="password" placeholder="Admin Password (Hint: 'admin')" class="w-full card p-3 rounded-lg mb-6 text-white focus:ring-primary-color focus:ring-2">
                <button (click)="handleChefLogin(chefPassword.value)" class="main-button w-full py-3 px-6 rounded-lg font-semibold text-lg hover:bg-red-400 transition">
                    Log in
                </button>
                <button (click)="navigateTo('welcome')" class="mt-4 text-sm text-gray-500 hover:underline">Back to Welcome</button>
            </div>
        }
        @case ('payment-options') {
            <header class="p-4 flex justify-between items-center card rounded-xl mb-4">
                <h1 class="text-2xl font-bold">Payment Options</h1>
                <button (click)="navigateTo('cart')" class="text-sm text-primary-color hover:underline">Back to Cart</button>
            </header>

            <div class="card p-5 rounded-xl mb-6">
                <div class="flex justify-between text-3xl font-bold mb-6">
                    <span class="text-gray-400">TOTAL DUE:</span>
                    <span class="text-primary-color">R {{ cartTotal() | number:'1.2-2' }}</span>
                </div>

                <h2 class="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Select Method</h2>

                <div class="space-y-3">
                    @for (method of paymentMethods; track method) {
                        <button (click)="selectPaymentMethod(method)"
                                class="w-full card p-4 rounded-xl flex items-center justify-between hover:bg-gray-700 transition duration-200">
                            <span class="text-lg font-semibold">{{ method }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-color"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    }
                </div>
            </div>
        }
        @case ('card-payment') {
            <header class="p-4 flex justify-between items-center card rounded-xl mb-4">
                <h1 class="text-2xl font-bold">Secure Card Payment</h1>
                <button (click)="navigateTo('payment-options')" class="text-sm text-primary-color hover:underline">Change Method</button>
            </header>
            <div class="card p-5 rounded-xl mb-6 space-y-4">
                <div class="flex justify-between text-2xl font-bold">
                    <span class="text-gray-400">Paying:</span>
                    <span class="text-primary-color">R {{ cartTotal() | number:'1.2-2' }}</span>
                </div>
                <!-- Card Input Fields: Requires Card Number, Expiry, CVC -->
                <input #cardNumber type="text" placeholder="Card Number (16 digits)" maxlength="16" class="w-full card p-3 rounded-lg text-white focus:ring-primary-color focus:ring-2">
                <div class="flex space-x-4">
                    <input #cardExpiry type="text" placeholder="MM/YY" maxlength="5" class="flex-1 card p-3 rounded-lg text-white focus:ring-primary-color focus:ring-2">
                    <input #cardCVC type="password" placeholder="CVC (3 or 4 digits)" maxlength="4" class="flex-1 card p-3 rounded-lg text-white focus:ring-primary-color focus:ring-2">
                </div>
                <button (click)="processCardPayment(cardNumber.value, cardExpiry.value, cardCVC.value)" class="main-button w-full py-3 rounded-lg font-semibold text-lg hover:bg-red-400 transition">
                    Submit Payment
                </button>
            </div>
        }
        @case ('cash-payment') {
            <header class="p-4 flex justify-between items-center card rounded-xl mb-4">
                <h1 class="text-2xl font-bold">Cash Payment Instructions</h1>
                <button (click)="navigateTo('payment-options')" class="text-sm text-primary-color hover:underline">Change Method</button>
            </header>
            <div class="card p-5 rounded-xl text-center mb-6">
                <h2 class="text-4xl font-extrabold text-primary-color mb-3">#{{ orderNumber() }}</h2>
                <p class="text-2xl font-bold text-white mb-6">Your Order Number</p>

                <div class="text-left bg-gray-700 p-4 rounded-lg space-y-3">
                    <p class="text-lg font-semibold text-white">Instructions (Pay at Counter):</p>
                    <ol class="list-decimal list-inside text-gray-300 space-y-1 pl-4">
                        <li>Please proceed to the **nearest counter** or cashier station.</li>
                        <li>Show them your **Order Number ({{ orderNumber() }})** and **Table Number ({{ tableNumber() }})**.</li>
                        <li>They will verify your R {{ cartTotal() | number:'1.2-2' }} order on their system.</li>
                        <li>Pay the cashier the total amount in cash.</li>
                    </ol>
                </div>

                <button (click)="clearCartAndStartNewOrder('Cash')" class="main-button w-full py-3 mt-6 rounded-lg font-semibold text-lg hover:bg-red-400 transition">
                    Acknowledge & Finish Order
                </button>
            </div>
        }
        @case ('confirmation') {
          <!-- Confirmation View -->
          <div class="h-screen flex flex-col justify-center items-center p-8 text-center">
            <svg class="text-green-500 mb-6" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h1 class="text-4xl font-bold text-white mb-2">Order #{{ orderNumber() }} Confirmed!</h1>
            <p class="text-xl text-gray-300 mb-4">Thank you, {{ userName() }}!</p>
            <p class="text-lg text-gray-400 mb-8">Your total of R {{ cartTotal() | number:'1.2-2' }} has been successfully processed via {{ paymentMethod() }}. Your order is now being prepared for Table #{{ tableNumber() }}.</p>
            <button (click)="clearCartAndStartNewOrder('Finished')" class="main-button py-3 px-6 rounded-lg font-semibold text-lg hover:bg-red-400 transition">
                Start New Order
            </button>
          </div>
        }
        @case ('chef') {
          <!-- Chef Admin Panel Content -->
          <header class="p-4 flex justify-between items-center card rounded-xl mb-4">
              <h1 class="text-2xl font-bold">Chef Admin Panel</h1>
              <button (click)="handleLogout()" class="text-sm text-primary-color hover:underline">Logout Admin</button>
          </header>

          <!-- Add New Item Form -->
          <div class="card p-5 rounded-xl mb-6">
              <h2 class="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Add New Menu Item</h2>
              <input type="text" #addName placeholder="Dish Name" class="w-full card p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary-color text-white">
              <textarea #addDescription placeholder="Description" rows="2" class="w-full card p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary-color text-white"></textarea>
              <select #addCourse class="w-full card p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary-color text-white">
                  <option value="" disabled selected>Select Course</option>
                  @for (course of courses; track course) {
                    <option [value]="course">{{ course }}</option>
                  }
              </select>
              <input type="number" #addPrice placeholder="Price (e.g. 199.50)" step="0.01" class="w-full card p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary-color text-white">

              <div class="flex space-x-2">
                  <button (click)="handleAddItemClick(addName.value, addDescription.value, addCourse.value, addPrice.value)" class="main-button flex-1 py-3 rounded-lg font-semibold hover:bg-red-400 transition">
                      Add Item
                  </button>
                  <button (click)="clearForm(addName, addDescription, addCourse, addPrice)" class="card flex-1 py-3 rounded-lg font-semibold hover:bg-gray-600 transition">
                      Clear
                  </button>
              </div>
          </div>

          <!-- Current Menu Items & Stock Control -->
          <div class="card p-5 rounded-xl">
              <h2 class="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Stock & Item Control</h2>
              <div id="chef-item-list" class="max-h-96 overflow-y-auto pr-2">
                  @if (menuItems().length === 0) {
                      <p class="text-gray-400">The menu is currently empty.</p>
                  } @else {
                      @for (item of menuItems(); track item.id) {
                          <div class="card p-3 rounded-lg flex justify-between items-center mb-2" [class.bg-gray-700]="!item.available">
                              <span class="font-semibold" [class.text-red-400]="!item.available">{{ item.name }} (R{{ item.price | number:'1.2-2' }})</span>
                              <div class="flex items-center space-x-3">
                                  <span class="text-xs font-bold px-2 py-1 rounded-full" [class.bg-green-500]="item.available" [class.bg-red-500]="!item.available">{{ item.available ? 'In Stock' : 'Out' }}</span>
                                  <button (click)="toggleAvailability(item.id)"
                                          class="text-sm font-semibold transition px-2 py-1 rounded-lg"
                                          [class.text-primary-color]="!item.available"
                                          [class.bg-gray-600]="!item.available"
                                          [class.text-red-400]="item.available"
                                          [class.bg-gray-800]="item.available">
                                      {{ item.available ? 'Mark Out' : 'Mark In' }}
                                  </button>
                              </div>
                          </div>
                      }
                  }
              </div>
          </div>
        }
        @case ('settings') {
            <header class="p-4 flex justify-between items-center card rounded-xl mb-4">
                <h1 class="text-2xl font-bold">App Settings & Help</h1>
                <button (click)="navigateTo('home')" class="text-sm text-primary-color hover:underline">Back to Menu</button>
            </header>
            <div class="space-y-6">
                <!-- Guide Section -->
                <div class="card p-5 rounded-xl">
                    <h2 class="text-xl font-semibold mb-3 border-b border-gray-600 pb-2">App Guide</h2>
                    <p class="text-gray-300">This guide explains how to use our ordering app:</p>
                    <ol class="list-decimal list-inside text-gray-400 mt-2 space-y-1 pl-4">
                        <li>**Setup**: Enter your name and table number once to personalize your session.</li>
                        <li>**Menu**: Browse by category. Items marked **SOLD OUT** are currently unavailable.</li>
                        <li>**Cart**: Review your items and apply the **Chef's Special** discount if eligible.</li>
                        <li>**Payment (Card)**: Enter mock details for a secure online simulation.</li>
                        <li>**Payment (Cash)**: Use your unique **Order Number** at the counter.</li>
                    </ol>
                </div>

                <!-- Feedback Section -->
                <div class="card p-5 rounded-xl">
                    <h2 class="text-xl font-semibold mb-3 border-b border-gray-600 pb-2">Send Feedback</h2>
                    <textarea #feedbackText placeholder="Your suggestions, complaints, or praise..." rows="3" class="w-full card p-3 rounded-lg text-white focus:ring-primary-color focus:ring-2 mb-3"></textarea>
                    <button (click)="sendFeedback(feedbackText.value)" class="main-button w-full py-2 rounded-lg font-semibold">Submit Feedback</button>
                </div>

                <!-- Queries Section -->
                <div class="card p-5 rounded-xl">
                    <h2 class="text-xl font-semibold mb-3 border-b border-gray-600 pb-2">Common Queries</h2>
                    <div class="space-y-2 text-gray-400">
                        <p class="font-semibold text-white">Q: How do I change my order after checkout?</p>
                        <p class="text-sm pl-2">A: Please speak directly to your server or the counter staff immediately, referencing your order number.</p>
                        <p class="font-semibold text-white">Q: Is the special discount applied automatically?</p>
                        <p class="text-sm pl-2">A: Yes, the 'Buy 2 Mains' discount is automatically calculated in the cart summary.</p>
                    </div>
                </div>
            </div>
        }
        @default {
          <div class="text-center mt-20 text-red-500">Page Error. Navigating to Welcome...</div>
          {{ navigateTo('welcome') }}
        }
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #1a1a1a;
      color: #f3f4f6;
      font-family: 'Inter', sans-serif;
    }
    .app-container {
      min-height: 100vh;
      max-width: 600px;
      margin: 0 auto;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      padding: 1rem;
    }
    .card {
      background-color: #333333;
      border: 1px solid #333333; /* Default border */
    }
    .main-button {
      background-color: #fca5a5; /* Light Red/Pink */
      color: #1a1a1a;
    }
    .primary-color {
      color: #fca5a5;
    }
    .sticky {
        position: -webkit-sticky;
        position: sticky;
    }
    /* Ensure inputs contrast well with the dark card background */
    input.card, textarea.card, select.card {
        border: 1px solid #4f4f4f;
    }

    /* Style for immediate visual feedback */
    .item-flash {
        border: 2px solid #fca5a5; /* Flash border */
        box-shadow: 0 0 10px rgba(252, 165, 165, 0.7); /* Glow effect */
        animation: flash-border 0.5s ease-out;
    }
    @keyframes flash-border {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.01); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class App {

  // =================================================================
  // 3. State Management (Signals)
  // =================================================================

  /** @type {Signal<MenuItem[]>} The core list of menu items. */
  menuItems = signal<MenuItem[]>(menuService.menuItems());

  /** @type {Signal<CartItem[]>} The items currently in the shopping cart. */
  cartItems = signal<CartItem[]>(cartService.cartItems());

  /** @type {Signal<string>} The current page view identifier. Starts on 'welcome'. */
  currentPage = signal<Page>('welcome');

  /** @type {Signal<Course | 'All'>} The currently selected filter category. */
  currentFilter = signal<Course | 'All'>('All');

  /** @type {Signal<string | null>} State for showing custom alerts. */
  alertMessage = signal<string | null>(null);

  /** @type {Signal<PaymentMethod | null>} Selected payment method (Card, Cash, Voucher). */
  paymentMethod = signal<PaymentMethod | null>(null);

  /** @type {Signal<string>} Customer's name. Starts as 'Guest' until setup is complete. */
  userName = signal<string>('Guest');

  /** @type {Signal<number>} Customer's table number. Starts at 0 until setup is complete. */
  tableNumber = signal<number>(0);

  /** @type {Signal<number | null>} ID of the item just added to cart, used for visual feedback. */
  recentlyAddedId = signal<number | null>(null);

  /** @type {Signal<number>} Unique order number. */
  orderNumber = signal<number>(generateOrderNumber()); // 5-digit order number

  /** @type {Course[]} Constant list of available courses. */
  courses: Course[] = menuService.courses;

  /** @type {PaymentMethod[]} Constant list of payment options. */
  paymentMethods: PaymentMethod[] = ['Card', 'Cash'];

  // Calculates the next available ID.
  private nextItemId = computed(() => {
    const items = this.menuItems();
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  });

  // =================================================================
  // 4. Computed Signals
  // =================================================================

  /** @type {Signal<MenuItem[]>} Filtered menu items based on current filter. */
  menuItemsForView = computed(() => {
    const items = this.menuItems();
    const filter = this.currentFilter();
    if (filter === 'All') return items;
    return items.filter(item => item.course === filter);
  });

  /** @type {Signal<number>} Total number of items in the cart. */
  cartItemCount = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  });

  /** @type {Signal<number>} Subtotal of all items in the cart before discounts. */
  cartSubtotal = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  /** @type {Signal<number>} Number of main courses in the cart. */
  mainCoursesCount = computed(() => {
    return this.cartItems().filter(item => item.course === 'Mains').reduce((total, item) => total + item.quantity, 0);
  });

  /** @type {Signal<number>} Special discount amount (R50 off for every 2 mains). */
  specialDiscountAmount = computed(() => {
    const mainsCount = this.mainCoursesCount();
    return Math.floor(mainsCount / 2) * 50;
  });

  /** @type {Signal<number>} Total discount applied. */
  specialDiscount = computed(() => {
    return this.specialDiscountAmount();
  });

  /** @type {Signal<number>} Final total after discounts. */
  cartTotal = computed(() => {
    return this.cartSubtotal() - this.specialDiscount();
  });

  // =================================================================
  // 5. Methods
  // =================================================================

  /** Navigate to a specific page. */
  navigateTo(page: string): void {
    this.currentPage.set(page as Page);
  }

  /** Handle customer setup with name and table number. */
  handleCustomerSetup(name: string, table: string): void {
    const trimmedName = name.trim();
    const tableNum = parseInt(table, 10);
    if (!trimmedName || isNaN(tableNum) || tableNum <= 0) {
      this.alertMessage.set('Please enter a valid name and table number.');
      return;
    }
    this.userName.set(trimmedName);
    this.tableNumber.set(tableNum);
    this.navigateTo('home');
  }

  /** Set the current menu filter. */
  setFilter(filter: Course | 'All'): void {
    this.currentFilter.set(filter);
    this.navigateTo('home');
  }

  /** Get the quantity of a specific item in the cart. */
  getItemQuantity(itemId: number): number {
    const item = this.cartItems().find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  }

  /** Add an item to the cart. */
  addToCart(item: MenuItem): void {
    if (!item.available) {
      this.alertMessage.set(`${item.name} is currently SOLD OUT and cannot be added to your order.`);
      return;
    }
    const currentCart = this.cartItems();
    const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      this.updateCartQuantity(item.id, existingItem.quantity + 1);
    } else {
      this.cartItems.set([...currentCart, { ...item, quantity: 1 }]);
    }
    this.recentlyAddedId.set(item.id);
    setTimeout(() => this.recentlyAddedId.set(null), 500); // Reset after animation
  }

  /** Update the quantity of an item in the cart. */
  updateCartQuantity(itemId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.cartItems.set(this.cartItems().filter(item => item.id !== itemId));
      return;
    }
    this.cartItems.set(
      this.cartItems().map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  /** Handle chef login. */
  handleChefLogin(password: string): void {
    if (password === 'admin') {
      this.navigateTo('chef');
    } else {
      this.alertMessage.set('Incorrect password. Please try again.');
    }
  }

  /** Select a payment method. */
  selectPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod.set(method);
    if (method === 'Card') {
      this.navigateTo('card-payment');
    } else if (method === 'Cash') {
      this.navigateTo('cash-payment');
    } else {
      this.alertMessage.set(`${method} payment is not yet implemented.`);
    }
  }

  /** Process card payment. */
  processCardPayment(cardNumber: string, expiry: string, cvc: string): void {
    // Basic validation
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      this.alertMessage.set('Please enter a valid 16-digit card number.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      this.alertMessage.set('Please enter expiry in MM/YY format.');
      return;
    }
    if (cvc.length < 3 || cvc.length > 4 || !/^\d+$/.test(cvc)) {
      this.alertMessage.set('Please enter a valid CVC (3 or 4 digits).');
      return;
    }
    // Simulate payment processing
    this.navigateTo('confirmation');
  }

  /** Clear cart and start a new order. */
  clearCartAndStartNewOrder(paymentType: string): void {
    this.cartItems.set([]);
    this.paymentMethod.set(paymentType === 'Finished' ? null : paymentType as PaymentMethod);
    this.orderNumber.set(Math.floor(Math.random() * 90000) + 10000);
    this.navigateTo('welcome');
  }

  /** Handle logout. */
  handleLogout(): void {
    this.userName.set('Guest');
    this.tableNumber.set(0);
    this.cartItems.set([]);
    this.currentFilter.set('All');
    this.alertMessage.set(null);
    this.paymentMethod.set(null);
    this.recentlyAddedId.set(null);
    this.navigateTo('welcome');
  }

  /** Handle adding a new menu item. */
  handleAddItemClick(name: string, description: string, course: string, price: string): void {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const priceNum = parseFloat(price);
    if (!trimmedName || !trimmedDescription || !course || isNaN(priceNum) || priceNum <= 0) {
      this.alertMessage.set('Please fill in all fields with valid data.');
      return;
    }
    const newItem: MenuItem = {
      id: this.nextItemId(),
      name: trimmedName,
      description: trimmedDescription,
      course: course as Course,
      price: priceNum,
      image: 'https://placehold.co/400x150/9C27B0/FFFFFF?text=New+Item', // Placeholder
      available: true
    };
    this.menuItems.set([...this.menuItems(), newItem]);
    this.alertMessage.set(`${trimmedName} successfully added to the menu!`);
  }

  /** Clear the add item form. */
  clearForm(nameInput: HTMLInputElement, descInput: HTMLTextAreaElement, courseSelect: HTMLSelectElement, priceInput: HTMLInputElement): void {
    nameInput.value = '';
    descInput.value = '';
    courseSelect.selectedIndex = 0;
    priceInput.value = '';
  }

  /** Toggle availability of a menu item. */
  toggleAvailability(itemId: number): void {
    const updatedItems = this.menuItems().map(item => {
      if (item.id === itemId) {
        const newAvailability = !item.available;
        // If marking out of stock, remove from cart
        if (!newAvailability) {
          this.cartItems.set(this.cartItems().filter(cartItem => cartItem.id !== itemId));
          this.alertMessage.set(`${item.name} marked OUT OF STOCK. Removed from customer carts.`);
        } else {
          this.alertMessage.set(`${item.name} marked IN STOCK.`);
        }
        return { ...item, available: newAvailability };
      }
      return item;
    });
    this.menuItems.set(updatedItems);
  }

  /** Send feedback. */
  sendFeedback(feedback: string): void {
    const trimmedFeedback = feedback.trim();
    if (!trimmedFeedback) {
      this.alertMessage.set('Please enter some feedback.');
      return;
    }
    // In a real app, this would send to a server
    this.alertMessage.set('Thank you for your feedback! It has been submitted.');
  }
}
