import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await connectDB();

        // Update order status to 'paid'
        const updatedOrder = await Order.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { 
            status: 'paid',
            paidAt: new Date(),
            paymentDetails: {
              stripePaymentIntentId: paymentIntent.id,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              paymentMethod: paymentIntent.payment_method,
            }
          },
          { new: true }
        );

        if (updatedOrder) {
          console.log(`✅ Order ${updatedOrder._id} marked as paid`);
        } else {
          console.warn(`⚠️ No order found for payment intent ${paymentIntent.id}`);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await connectDB();

        // Update order status to 'payment_failed'
        const updatedOrder = await Order.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { 
            status: 'payment_failed',
            paymentError: paymentIntent.last_payment_error?.message || 'Payment failed'
          },
          { new: true }
        );

        if (updatedOrder) {
          console.log(`❌ Order ${updatedOrder._id} marked as payment failed`);
        }

        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await connectDB();

        // Update order status to 'canceled'
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { status: 'canceled' },
          { new: true }
        );

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}