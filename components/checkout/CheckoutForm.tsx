'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { CreditCard, MapPin, User, Mail, Lock, Loader2 } from 'lucide-react';
import type { Address } from '@/lib/types';

// Load Stripe outside of a component's render to avoid recreating the Stripe object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Stripe card element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      fontFamily: '"Inter", system-ui, sans-serif',
      '::placeholder': {
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
    invalid: {
      iconColor: '#ff2b4a',
      color: '#ff2b4a',
    },
  },
};

// Main checkout form component wrapped with Stripe Elements
function CheckoutFormInner() {
  const { data: session } = useSession();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: session?.user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['name', 'street', 'city', 'state', 'zipCode'];
    const missing = required.filter(field => !shippingAddress[field as keyof Address]);
    
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(', ')}`);
      return false;
    }
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }
    
    return true;
  };

  const stripe = useStripe();
  const elements = useElements();
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!stripe || !elements) {
      toast.error('Stripe is not loaded yet. Please try again.');
      return;
    }
    
    setLoading(true);
    setProcessingPayment(true);
    
    try {
      // Create payment intent
      const paymentResponse = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: Math.round(total * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            customerEmail: session?.user?.email,
            customerName: shippingAddress.name,
          }
        }),
      });

      const paymentData = await paymentResponse.json();
      
      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Failed to create payment intent');
      }

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: shippingAddress.name,
              email: session?.user?.email || '',
              address: {
                line1: shippingAddress.street,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postal_code: shippingAddress.zipCode,
                country: shippingAddress.country,
              },
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        // Create order with payment confirmation
        const orderData = {
          items: items.map(item => ({
            productId: item.productId,
            product: item.product,
            variant: item.variant,
            quantity: item.quantity,
            price: item.price
          })),
          total,
          shippingAddress,
          paymentIntentId: paymentIntent.id
        };

        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        const orderResult = await orderResponse.json();
        
        if (orderResponse.ok && orderResult.success) {
          toast.success('Payment successful! Order placed.');
          clearCart();
          
          // Redirect to order confirmation
          setTimeout(() => {
            window.location.href = `/orders/${orderResult.order._id}?success=true&payment_intent=${paymentIntent.id}`;
          }, 1000);
        } else {
          // Payment succeeded but order creation failed - this needs manual handling
          console.error('Payment succeeded but order creation failed:', orderResult);
          toast.error('Payment processed but order creation failed. Please contact support.');
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Information */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-auraRed/20 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-brand-auraRed" />
          </div>
          <h2 className="text-xl font-bold text-white">Shipping Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                name="name"
                required
                value={shippingAddress.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white
                         placeholder:text-white/50 focus:outline-none focus:border-brand-auraRed/50"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white/70
                         placeholder:text-white/50 cursor-not-allowed"
                placeholder="Email address"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-white/90 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            name="street"
            required
            value={shippingAddress.street}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white
                     placeholder:text-white/50 focus:outline-none focus:border-brand-auraRed/50"
            placeholder="Enter your street address"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              required
              value={shippingAddress.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white
                       placeholder:text-white/50 focus:outline-none focus:border-brand-auraRed/50"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              State *
            </label>
            <select
              name="state"
              required
              value={shippingAddress.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white
                       focus:outline-none focus:border-brand-auraRed/50"
            >
              <option value="" className="bg-brand-black">Select State</option>
              <option value="CA" className="bg-brand-black">California</option>
              <option value="NY" className="bg-brand-black">New York</option>
              <option value="TX" className="bg-brand-black">Texas</option>
              <option value="FL" className="bg-brand-black">Florida</option>
              {/* Add more states as needed */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              name="zipCode"
              required
              value={shippingAddress.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white
                       placeholder:text-white/50 focus:outline-none focus:border-brand-auraRed/50"
              placeholder="12345"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Payment Method</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/20">
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-brand-auraRed focus:ring-brand-auraRed"
            />
            <label htmlFor="card" className="text-white font-medium">Credit Card</label>
          </div>

          {/* Stripe Card Element */}
          <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
              <Lock className="w-4 h-4" />
              <span>Secure Payment with Stripe</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <CardElement options={cardElementOptions} />
            </div>
            <p className="text-white/60 text-xs mt-2">
              💳 Test card: 4242 4242 4242 4242 • Any future date • Any CVC
            </p>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <motion.button
        type="submit"
        disabled={loading || !stripe || !elements}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full py-4 bg-aura-gradient text-white font-bold text-lg rounded-lg
                 hover:shadow-lg hover:shadow-brand-auraRed/25 transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            {processingPayment ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            )}
            {processingPayment ? 'Processing Payment...' : 'Processing Order...'}
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay ${total.toFixed(2)}
          </>
        )}
      </motion.button>
    </form>
  );
}

// Wrapper component with Stripe Elements provider
export function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner />
    </Elements>
  );
}