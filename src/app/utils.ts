import { Course, MenuItem, AveragePriceData } from './types';

/**
 * Utility functions for calculations and data processing
 */

/**
 * Calculate average prices by course using for loops
 * @param items Array of menu items
 * @param courses Array of available courses
 * @returns Array of average price data
 */
export function calculateAveragePrices(items: MenuItem[], courses: Course[]): AveragePriceData[] {
  const averages: AveragePriceData[] = [];

  // Use for loop to iterate through courses
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
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

/**
 * Filter menu items by course using for loops
 * @param items Array of menu items
 * @param course Course to filter by
 * @returns Filtered array of menu items
 */
export function filterItemsByCourse(items: MenuItem[], course: Course): MenuItem[] {
  const filtered: MenuItem[] = [];

  // Use for loop to filter items
  for (let i = 0; i < items.length; i++) {
    if (items[i].course === course) {
      filtered.push(items[i]);
    }
  }

  return filtered;
}

/**
 * Validate customer setup input
 * @param name Customer name
 * @param table Table number as string
 * @returns Object with isValid boolean and error message
 */
export function validateCustomerSetup(name: string, table: string): { isValid: boolean; error?: string } {
  const trimmedName = name.trim();
  const tableNum = parseInt(table, 10);

  if (!trimmedName) {
    return { isValid: false, error: 'Please enter a valid name.' };
  }

  if (isNaN(tableNum) || tableNum <= 0) {
    return { isValid: false, error: 'Please enter a valid table number.' };
  }

  return { isValid: true };
}

/**
 * Validate card payment input
 * @param cardNumber Card number
 * @param expiry Expiry date (MM/YY)
 * @param cvc CVC code
 * @returns Object with isValid boolean and error message
 */
export function validateCardPayment(cardNumber: string, expiry: string, cvc: string): { isValid: boolean; error?: string } {
  if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
    return { isValid: false, error: 'Please enter a valid 16-digit card number.' };
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return { isValid: false, error: 'Please enter expiry in MM/YY format.' };
  }

  if (cvc.length < 3 || cvc.length > 4 || !/^\d+$/.test(cvc)) {
    return { isValid: false, error: 'Please enter a valid CVC (3 or 4 digits).' };
  }

  return { isValid: true };
}

/**
 * Generate unique order number
 * @returns 5-digit order number
 */
export function generateOrderNumber(): number {
  return Math.floor(Math.random() * 90000) + 10000;
}

/**
 * Format currency amount
 * @param amount Number to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return `R ${amount.toFixed(2)}`;
}

/**
 * Use for-in loop to iterate over object properties (demonstration)
 * @param obj Object to iterate
 * @returns Array of property names
 */
export function getObjectKeys(obj: any): string[] {
  const keys: string[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
}

/**
 * Use while loop to find item in array (demonstration)
 * @param items Array to search
 * @param predicate Function to test each item
 * @returns Found item or undefined
 */
export function findItemWithWhile<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  let i = 0;
  while (i < items.length) {
    if (predicate(items[i])) {
      return items[i];
    }
    i++;
  }
  return undefined;
}
