import { renderHook, act } from '@testing-library/react';
import { useCart } from '@/hooks/useCart';

describe('useCart', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  test('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  test('adds item to cart', () => {
    const { result } = renderHook(() => useCart());
    const item = { id: '1', name: 'Test Product', price: 99.99, quantity: 1 };

    act(() => {
      result.current.addItem(item);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(item);
    expect(result.current.total).toBe(99.99);
  });

  test('updates quantity of existing item', () => {
    const { result } = renderHook(() => useCart());
    const item = { id: '1', name: 'Test Product', price: 99.99, quantity: 1 };

    act(() => {
      result.current.addItem(item);
      result.current.updateQuantity('1', 2);
    });

    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.total).toBe(199.98);
  });

  test('removes item from cart', () => {
    const { result } = renderHook(() => useCart());
    const item = { id: '1', name: 'Test Product', price: 99.99, quantity: 1 };

    act(() => {
      result.current.addItem(item);
      result.current.removeItem('1');
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  test('clears cart', () => {
    const { result } = renderHook(() => useCart());
    const items = [
      { id: '1', name: 'Product 1', price: 99.99, quantity: 1 },
      { id: '2', name: 'Product 2', price: 149.99, quantity: 2 },
    ];

    act(() => {
      items.forEach(item => result.current.addItem(item));
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  test('persists cart state in localStorage', () => {
    const { result } = renderHook(() => useCart());
    const item = { id: '1', name: 'Test Product', price: 99.99, quantity: 1 };

    act(() => {
      result.current.addItem(item);
    });

    // Create a new hook instance to test persistence
    const { result: newResult } = renderHook(() => useCart());
    expect(newResult.current.items).toHaveLength(1);
    expect(newResult.current.items[0]).toEqual(item);
  });
});