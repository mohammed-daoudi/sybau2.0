import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartItems } from '@/components/cart/CartItems';
import { CartSummary } from '@/components/cart/CartSummary';
import { useCart } from '@/hooks/useCart';

// Mock the useCart hook
jest.mock('@/hooks/useCart', () => ({
  useCart: jest.fn(),
}));

describe('Cart Components', () => {
  const mockItems = [
    {
      _id: '1',
      title: 'Test Product 1',
      price: 99.99,
      quantity: 2,
      images: ['test1.jpg'],
      slug: 'test-1',
      stock: 10,
    },
    {
      _id: '2',
      title: 'Test Product 2',
      price: 149.99,
      quantity: 1,
      images: ['test2.jpg'],
      slug: 'test-2',
      stock: 5,
    },
  ];

  const mockCartHook = {
    items: mockItems,
    total: 349.97,
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
  };

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue(mockCartHook);
  });

  describe('CartItems', () => {
    test('renders cart items correctly', () => {
      render(<CartItems />);

      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('$149.99')).toBeInTheDocument();
    });

    test('handles quantity updates', () => {
      render(<CartItems />);

      const quantityInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(quantityInputs[0], { target: { value: '3' } });

      expect(mockCartHook.updateQuantity).toHaveBeenCalledWith('1', 3);
    });

    test('handles item removal', () => {
      render(<CartItems />);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      fireEvent.click(removeButtons[0]);

      expect(mockCartHook.removeItem).toHaveBeenCalledWith('1');
    });

    test('shows empty cart message when no items', () => {
      (useCart as jest.Mock).mockReturnValue({
        ...mockCartHook,
        items: [],
      });

      render(<CartItems />);

      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    test('validates quantity against stock', () => {
      render(<CartItems />);

      const quantityInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(quantityInputs[0], { target: { value: '20' } });

      expect(mockCartHook.updateQuantity).not.toHaveBeenCalled();
      expect(screen.getByText(/exceeds available stock/i)).toBeInTheDocument();
    });
  });

  describe('CartSummary', () => {
    test('displays correct total and subtotal', () => {
      render(<CartSummary />);

      expect(screen.getByText('$349.97')).toBeInTheDocument();
      expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    });

    test('calculates tax correctly', () => {
      const taxRate = 0.1; // 10% tax
      render(<CartSummary taxRate={taxRate} />);

      const subtotal = mockCartHook.total;
      const expectedTax = subtotal * taxRate;

      expect(screen.getByText(`$${expectedTax.toFixed(2)}`)).toBeInTheDocument();
    });

    test('handles checkout button click', () => {
      const onCheckout = jest.fn();
      render(<CartSummary onCheckout={onCheckout} />);

      const checkoutButton = screen.getByRole('button', { name: /checkout/i });
      fireEvent.click(checkoutButton);

      expect(onCheckout).toHaveBeenCalled();
    });

    test('disables checkout button when cart is empty', () => {
      (useCart as jest.Mock).mockReturnValue({
        ...mockCartHook,
        items: [],
        total: 0,
      });

      render(<CartSummary />);

      const checkoutButton = screen.getByRole('button', { name: /checkout/i });
      expect(checkoutButton).toBeDisabled();
    });

    test('shows shipping cost when applicable', () => {
      const shippingCost = 9.99;
      render(<CartSummary shippingCost={shippingCost} />);

      expect(screen.getByText(`$${shippingCost.toFixed(2)}`)).toBeInTheDocument();
      expect(screen.getByText(/shipping/i)).toBeInTheDocument();
    });

    test('displays free shipping message when eligible', () => {
      render(<CartSummary freeShippingThreshold={300} />);

      expect(screen.getByText(/free shipping/i)).toBeInTheDocument();
    });
  });
});