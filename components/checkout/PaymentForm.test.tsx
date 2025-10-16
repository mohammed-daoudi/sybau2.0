import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe, StripeElements, StripeCardElement, PaymentIntentResult } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';

// Mock Stripe
const mockCardElement = {
  mount: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
  unmount: jest.fn(),
  update: jest.fn(),
  blur: jest.fn(),
  clear: jest.fn(),
  focus: jest.fn(),
  _implementation: { _empty: false },
} as unknown as StripeCardElement;

const mockElements = {
  create: jest.fn(() => mockCardElement),
  getElement: jest.fn(() => mockCardElement),
} as unknown as StripeElements;

const elements = jest.fn(() => mockElements);

const mockStripeInstance = {
  elements,
  retrievePaymentIntent: jest.fn().mockReturnValue(Promise.resolve({})),
  confirmCardPayment: jest.fn().mockImplementation(() => Promise.resolve({ paymentIntent: null })),
  redirectToCheckout: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
  confirmPayment: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
  confirmAcssDebitPayment: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
  confirmUsBankAccountPayment: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
  createToken: jest.fn().mockImplementation(() => Promise.resolve({ token: null, error: null })),
  handleCardAction: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
  createSource: jest.fn().mockImplementation(() => Promise.resolve({ source: null, error: null })),
  createPaymentMethod: jest.fn().mockImplementation(() => Promise.resolve({ paymentMethod: null, error: null })),
  confirmSetup: jest.fn().mockImplementation(() => Promise.resolve({ setupIntent: null, error: null })),
  confirmCardSetup: jest.fn().mockImplementation(() => Promise.resolve({ setupIntent: null, error: null })),
  confirmSepaDebitSetup: jest.fn().mockImplementation(() => Promise.resolve({ setupIntent: null, error: null })),
  confirmFpxPayment: jest.fn().mockImplementation(() => Promise.resolve({ paymentIntent: null, error: null })),
  confirmAlipayPayment: jest.fn().mockImplementation(() => Promise.resolve({ paymentIntent: null, error: null })),
  confirmIdealPayment: jest.fn().mockImplementation(() => Promise.resolve({ paymentIntent: null, error: null })),
  confirmSepaDebitPayment: jest.fn().mockImplementation(() => Promise.resolve({ paymentIntent: null, error: null })),
  confirmSofortPayment: jest.fn().mockImplementation(() => Promise.resolve({ paymentIntent: null, error: null })),
  confirmBancontactPayment: jest.fn().mockImplementation(() => Promise.resolve({ paymentIntent: null, error: null })),
  confirmGrabPayPayment: jest.fn().mockImplementation(() => Promise.resolve({ paymentIntent: null, error: null })),
  confirmOxxoPayment: jest.fn().mockImplementation(() => Promise.resolve({ paymentIntent: null, error: null })),
  confirmWechatPayPayment: jest.fn().mockImplementation(() => Promise.resolve({ paymentIntent: null, error: null })),
  verifyIdentity: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
  handleNextAction: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
} as unknown as jest.Mocked<Stripe>;

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve(mockStripeInstance)),
}));

// Mock useToast
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe('PaymentForm', () => {
  const mockOrder = {
    id: 'order_123',
    amount: 29999, // $299.99
    currency: 'usd',
    items: [
      { id: '1', name: 'Test Product', price: 29999, quantity: 1 },
    ],
  };

  const mockClientSecret = 'pi_123_secret_456';
  const mockCardElement = {
    mount: jest.fn(),
    on: jest.fn(),
    unmount: jest.fn(),
    _implementation: { _empty: false },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStripeInstance.elements.mockReturnValue({
      create: jest.fn(() => mockCardElement),
    });
    global.fetch = jest.fn();
  });

  test('initializes Stripe elements', async () => {
    render(
      <Elements stripe={await loadStripe('dummy_key')}>
        <PaymentForm 
          order={mockOrder}
          clientSecret={mockClientSecret}
        />
      </Elements>
    );

    expect(screen.getByText(/card information/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pay/i })).toBeInTheDocument();
  });

  test('displays order summary', async () => {
    render(
      <Elements stripe={await loadStripe('dummy_key')}>
        <PaymentForm 
          order={mockOrder}
          clientSecret={mockClientSecret}
        />
      </Elements>
    );

    expect(screen.getByText('$299.99')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  test('handles successful payment', async () => {
    const mockPaymentIntent = {
      id: 'pi_123',
      object: 'payment_intent',
      amount: 2000,
      client_secret: 'pi_123_secret_456',
      status: 'succeeded',
      currency: 'usd',
      livemode: false,
      created: 1589308066,
      payment_method_types: ['card'],
      payment_method: 'pm_123',
      setup_future_usage: null,
      last_payment_error: null,
      capture_method: 'automatic',
      confirmation_method: 'automatic',
      canceled_at: null,
      cancellation_reason: null,
      description: null,
      next_action: null,
      receipt_email: null,
      shipping: null,
    } as const;

    const mockPaymentIntentResult: PaymentIntentResult = {
      error: undefined,
      paymentIntent: {
        id: 'pi_123',
        object: 'payment_intent' as const,
        amount: 2000,
        canceled_at: null,
        cancellation_reason: null,
        capture_method: 'automatic' as const,
        client_secret: 'pi_123_secret_456',
        confirmation_method: 'automatic' as const,
        created: 1589308066,
        currency: 'usd',
        description: null,
        last_payment_error: null,
        livemode: false,
        next_action: null,
        payment_method: 'pm_123',
        payment_method_types: ['card'],
        receipt_email: null,
        setup_future_usage: null,
        shipping: null,
        status: 'succeeded' as const,
      },
    };

    mockStripeInstance.confirmCardPayment.mockResolvedValueOnce(mockPaymentIntentResult);

    render(
      <Elements stripe={await loadStripe('dummy_key')}>
        <PaymentForm 
          order={mockOrder}
          clientSecret={mockClientSecret}
          onSuccess={jest.fn()}
        />
      </Elements>
    );

    const submitButton = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockStripeInstance.confirmCardPayment).toHaveBeenCalledWith(
        'pi_123_secret_456',
        {
          payment_method: {
            card: mockCardElement,
            billing_details: {
              name: '',
              email: '',
            },
          },
        },
      );
    });
  });

  test('handles payment errors', async () => {
    mockStripeInstance.confirmCardPayment.mockResolvedValueOnce({
      error: {
        type: 'card_error',
        charge: 'ch_123',
        code: 'card_declined',
        decline_code: 'generic_decline',
        doc_url: 'https://stripe.com/docs/error-codes/card-declined',
        message: 'Your card was declined',
        param: 'card',
      } as const,
      paymentIntent: undefined,
    } as PaymentIntentResult);

    render(
      <Elements stripe={await loadStripe('dummy_key')}>
        <PaymentForm 
          order={mockOrder}
          clientSecret={mockClientSecret}
        />
      </Elements>
    );

    const submitButton = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Payment Failed',
        description: 'Your card was declined',
        variant: 'destructive',
      });
    });
  });

  test('validates billing details', async () => {
    render(
      <Elements stripe={await loadStripe('dummy_key')}>
        <PaymentForm 
          order={mockOrder}
          clientSecret={mockClientSecret}
        />
      </Elements>
    );

    const submitButton = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/billing name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/billing email is required/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during payment processing', async () => {
    mockStripeInstance.confirmCardPayment.mockImplementation(() => new Promise<PaymentIntentResult>(() => {}));

    render(
      <Elements stripe={await loadStripe('dummy_key')}>
        <PaymentForm 
          order={mockOrder}
          clientSecret={mockClientSecret}
        />
      </Elements>
    );

    const submitButton = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('handles network errors', async () => {
    mockStripeInstance.confirmCardPayment.mockRejectedValueOnce(new Error('Network error'));

    render(
      <Elements stripe={await loadStripe('dummy_key')}>
        <PaymentForm 
          order={mockOrder}
          clientSecret={mockClientSecret}
        />
      </Elements>
    );

    const submitButton = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    });
  });

  test('validates card element', async () => {
    mockCardElement._implementation._empty = true;

    render(
      <Elements stripe={mockStripeInstance}>
        <PaymentForm 
          order={mockOrder}
          clientSecret={mockClientSecret}
        />
      </Elements>
    );

    const submitButton = screen.getByRole('button', { name: /pay/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/please enter card details/i)).toBeInTheDocument();
    expect(mockStripeInstance.confirmCardPayment).not.toHaveBeenCalled();

    mockCardElement._implementation._empty = false;
  });
});