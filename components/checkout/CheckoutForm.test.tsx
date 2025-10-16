import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@/lib/validations/checkout';

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({})),
}));

describe('CheckoutForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  test('renders all form fields', () => {
    render(<CheckoutForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<CheckoutForm onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/city is required/i)).toBeInTheDocument();
      expect(screen.getByText(/postal code is required/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('validates email format', async () => {
    render(<CheckoutForm onSubmit={mockSubmit} />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('validates postal code format', async () => {
    render(<CheckoutForm onSubmit={mockSubmit} />);

    fireEvent.input(screen.getByLabelText(/postal code/i), {
      target: { value: '123' }, // Too short
    });

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid postal code/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    render(<CheckoutForm onSubmit={mockSubmit} />);

    const validData = {
      email: 'test@example.com',
      name: 'Test User',
      address: '123 Test St',
      city: 'Test City',
      postalCode: '12345',
      country: 'US',
    };

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: validData.email },
    });
    fireEvent.input(screen.getByLabelText(/name/i), {
      target: { value: validData.name },
    });
    fireEvent.input(screen.getByLabelText(/address/i), {
      target: { value: validData.address },
    });
    fireEvent.input(screen.getByLabelText(/city/i), {
      target: { value: validData.city },
    });
    fireEvent.input(screen.getByLabelText(/postal code/i), {
      target: { value: validData.postalCode },
    });

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(validData);
    });
  });

  test('handles server validation errors', async () => {
    const serverError = 'This email is already in use';
    mockSubmit.mockRejectedValueOnce(new Error(serverError));

    render(<CheckoutForm onSubmit={mockSubmit} />);

    const validData = {
      email: 'test@example.com',
      name: 'Test User',
      address: '123 Test St',
      city: 'Test City',
      postalCode: '12345',
      country: 'US',
    };

    Object.entries(validData).forEach(([field, value]) => {
      fireEvent.input(screen.getByLabelText(new RegExp(field, 'i')), {
        target: { value },
      });
    });

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(screen.getByText(serverError)).toBeInTheDocument();
    });
  });
});