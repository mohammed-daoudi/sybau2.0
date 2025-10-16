import { formatPrice, calculateTotal, calculateTax } from '@/lib/utils';

describe('Price Formatting', () => {
  test('formats price with currency symbol', () => {
    expect(formatPrice(10)).toBe('$10.00');
    expect(formatPrice(10.5)).toBe('$10.50');
    expect(formatPrice(10.99)).toBe('$10.99');
  });

  test('handles zero and negative values', () => {
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(-10)).toBe('-$10.00');
  });

  test('handles large numbers', () => {
    expect(formatPrice(1000)).toBe('$1,000.00');
    expect(formatPrice(1000000)).toBe('$1,000,000.00');
  });
});

describe('Total Calculation', () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 15, quantity: 1 },
  ];

  test('calculates subtotal correctly', () => {
    expect(calculateTotal(items)).toBe(35);
  });

  test('handles empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('handles single item', () => {
    expect(calculateTotal([{ price: 10, quantity: 1 }])).toBe(10);
  });
});

describe('Tax Calculation', () => {
  test('calculates tax amount correctly', () => {
    expect(calculateTax(100, 0.1)).toBe(10);
    expect(calculateTax(50, 0.05)).toBe(2.5);
  });

  test('handles zero values', () => {
    expect(calculateTax(0, 0.1)).toBe(0);
    expect(calculateTax(100, 0)).toBe(0);
  });

  test('rounds to 2 decimal places', () => {
    expect(calculateTax(100, 0.075)).toBe(7.50);
    expect(calculateTax(33.33, 0.1)).toBe(3.33);
  });
});