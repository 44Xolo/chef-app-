import { signal, computed } from '@angular/core';
import { MenuItem, Course, AveragePriceData } from './types';

/**
 * Service for managing menu items and related operations
 */
export class MenuService {
  /** Core list of menu items */
  private menuItemsSignal = signal<MenuItem[]>([
    { id: 1, name: "Rib King Ribs", description: "Slow cooked ribs with smoky BBQ sauce.", course: "Mains", price: 250.00, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=150&fit=crop', available: true },
    { id: 2, name: "Caesar Salad", description: "Romaine lettuce, croutons, parmesan, Caesar dressing.", course: "Starters", price: 95.00, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=150&fit=crop', available: true },
    { id: 3, name: "Chocolate Lava Cake", description: "Warm molten chocolate cake with vanilla ice cream.", course: "Desserts", price: 75.00, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=150&fit=crop', available: true },
    { id: 4, name: "Fresh Orange Juice", description: "Freshly squeezed, no sugar added.", course: "Drinks", price: 45.00, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=150&fit=crop', available: true },
    { id: 5, name: "Grilled Salmon", description: "Served with asparagus and lemon butter sauce.", course: "Mains", price: 180.00, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=150&fit=crop', available: true },
    { id: 6, name: "Garlic Breadsticks", description: "Toasted bread with garlic butter and herbs.", course: "Starters", price: 60.00, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=150&fit=crop', available: false },
    { id: 7, name: "Burger Deluxe", description: "Wagyu patty, cheddar, lettuce, tomato, special sauce.", course: "Mains", price: 165.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=150&fit=crop', available: true },
  ]);

  /** Public getter for menu items */
  menuItems = this.menuItemsSignal.asReadonly();

  /** Available courses */
  courses: Course[] = ['Mains', 'Starters', 'Desserts', 'Drinks'];

  /** Calculate next available ID */
  private getNextId(): number {
    const items = this.menuItemsSignal();
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

  /** Add a new menu item */
  addItem(name: string, description: string, course: Course, price: number): void {
    const newItem: MenuItem = {
      id: this.getNextId(),
      name: name.trim(),
      description: description.trim(),
      course,
      price,
      image: 'https://placehold.co/400x150/9C27B0/FFFFFF?text=New+Item',
      available: true
    };
    this.menuItemsSignal.set([...this.menuItemsSignal(), newItem]);
  }

  /** Remove a menu item by ID */
  removeItem(itemId: number): boolean {
    const currentItems = this.menuItemsSignal();
    const itemExists = currentItems.some(item => item.id === itemId);

    if (itemExists) {
      this.menuItemsSignal.set(currentItems.filter(item => item.id !== itemId));
      return true;
    }
    return false;
  }

  /** Toggle availability of a menu item */
  toggleAvailability(itemId: number): boolean {
    const updatedItems = this.menuItemsSignal().map(item => {
      if (item.id === itemId) {
        return { ...item, available: !item.available };
      }
      return item;
    });
    this.menuItemsSignal.set(updatedItems);
    return true;
  }

  /** Calculate average prices by course using for loops */
  calculateAveragePrices(): AveragePriceData[] {
    const averages: AveragePriceData[] = [];
    const items = this.menuItemsSignal();

    // Use for loop to iterate through courses
    for (let i = 0; i < this.courses.length; i++) {
      const course = this.courses[i];
      let total = 0;
      let count = 0;

      // Use for loop to iterate through items
      for (let j = 0; j < items.length; j++) {
        if (items[j].course === course) {
          total += items[j].price;
          count++;
        }
      }

      if (count > 0) {
        averages.push({
          course,
          average: total / count,
          count
        });
      }
    }

    return averages;
  }

  /** Filter items by course */
  filterByCourse(course: Course): MenuItem[] {
    const items = this.menuItemsSignal();
    const filtered: MenuItem[] = [];

    // Use for loop to filter items
    for (let i = 0; i < items.length; i++) {
      if (items[i].course === course) {
        filtered.push(items[i]);
      }
    }

    return filtered;
  }

  /** Get item by ID */
  getItemById(id: number): MenuItem | undefined {
    const items = this.menuItemsSignal();
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        return items[i];
      }
    }
    return undefined;
  }
}

// Global instance
export const menuService = new MenuService();
