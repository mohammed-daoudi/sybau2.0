import { useEffect, useState } from 'react';
import { Stripe, StripeElements, StripeCardElement, loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface PaymentFormProps {
  order: {
    id: string;
    amount: number;
    currency: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  };
  clientSecret: string;
  onSuccess?: (paymentId: string) => void;
}

export function PaymentForm({ order, clientSecret, onSuccess }: PaymentFormProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState({
    card: '',
    name: '',
    email: '',
  });
  const [cardElement, setCardElement] = useState<StripeCardElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (stripeInstance) {
        setStripe(stripeInstance);
        const elementsInstance = stripeInstance.elements({
          clientSecret,
        });
        setElements(elementsInstance);
        const card = elementsInstance.create('card');
        setCardElement(card);
      }
    };
    initStripe();
  }, [clientSecret]);

  const validateForm = () => {
    const newErrors = {
      card: '',
      name: '',
      email: '',
    };

    if (!billingDetails.name) {
      newErrors.name = 'Billing name is required';
    }

    if (!billingDetails.email) {
      newErrors.email = 'Billing email is required';
    }

    if (!cardElement) {
      newErrors.card = 'Please enter card details';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
          },
        },
      });

      if (result.error) {
        toast({
          title: 'Payment Failed',
          description: result.error.message,
          variant: 'destructive',
        });
      } else if (result.paymentIntent?.status === 'succeeded') {
        onSuccess?.(result.paymentIntent.id);
        toast({
          title: 'Payment Successful',
          description: 'Your order has been confirmed',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order.currency,
    }).format(amount / 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name on Card</Label>
          <Input
            id="name"
            value={billingDetails.name}
            onChange={(e) => setBillingDetails((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="John Doe"
            disabled={isProcessing}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={billingDetails.email}
            onChange={(e) => setBillingDetails((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="john@example.com"
            disabled={isProcessing}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <Label>Card Information</Label>
          <div className="mt-1 border rounded-md p-3">
            {cardElement && (
              <div id="card-element" />
            )}
          </div>
          {errors.card && <p className="text-sm text-red-500">{errors.card}</p>}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span className="font-semibold">{formatPrice(order.amount)}</span>
        </div>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600">
            <span>{item.name}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || !elements || isProcessing}
      >
        {isProcessing ? (
          <>
            <Spinner className="mr-2" />
            Processing...
          </>
        ) : (
          `Pay ${formatPrice(order.amount)}`
        )}
      </Button>
    </form>
  );
}