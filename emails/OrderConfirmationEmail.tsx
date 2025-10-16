import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';
import { formatPrice } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  userName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    variant?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderStatus: OrderStatus;
  estimatedDelivery: string;
  orderUrl: string;
}

export default function OrderConfirmationEmail({
  orderNumber,
  userName,
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingAddress,
  orderStatus,
  estimatedDelivery,
  orderUrl,
}: OrderConfirmationEmailProps) {
  const previewText = `Order Confirmation - #${orderNumber}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Container style={container}>
        <Section style={section}>
          <Text style={heading}>Order Confirmation</Text>
          <Text style={text}>
            Hi {userName},
          </Text>
          <Text style={text}>
            Thank you for your order! We're excited to fulfill your SYBAU gear. Here's a summary of your order:
          </Text>

          {/* Order Number */}
          <Text style={subheading}>Order #{orderNumber}</Text>

          {/* Items */}
          <Section style={itemsContainer}>
            {items.map((item, index) => (
              <Section key={index} style={itemRow}>
                <Text style={itemText}>
                  {item.quantity}x {item.name}
                  {item.variant && ` (${item.variant})`}
                  <span style={itemPrice}>{formatPrice(item.price * item.quantity)}</span>
                </Text>
              </Section>
            ))}
          </Section>

          {/* Summary */}
          <Section style={summaryContainer}>
            <Text style={summaryRow}>
              Subtotal: <span style={summaryValue}>{formatPrice(subtotal)}</span>
            </Text>
            <Text style={summaryRow}>
              Shipping: <span style={summaryValue}>{formatPrice(shipping)}</span>
            </Text>
            <Text style={summaryRow}>
              Tax: <span style={summaryValue}>{formatPrice(tax)}</span>
            </Text>
            <Text style={summaryTotal}>
              Total: <span style={summaryValue}>{formatPrice(total)}</span>
            </Text>
          </Section>

          {/* Shipping Address */}
          <Section style={addressContainer}>
            <Text style={subheading}>Shipping Address:</Text>
            <Text style={addressText}>
              {shippingAddress.name}<br />
              {shippingAddress.street}<br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
              {shippingAddress.country}
            </Text>
          </Section>

          {/* Delivery Info */}
          <Text style={text}>
            Estimated Delivery: {estimatedDelivery}
          </Text>
          <Text style={text}>
            Current Status: {orderStatus}
          </Text>

          <Button href={orderUrl} style={button}>
            View Order Details
          </Button>

          <Text style={footerText}>
            If you have any questions about your order, please don't hesitate to contact our support team.
          </Text>

          <Text style={text}>
            Best regards,<br />
            The SYBAU Team
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

const container = {
  backgroundColor: '#f5f5f5',
  padding: '40px 0',
};

const section = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '40px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center' as const,
  color: '#111827',
};

const subheading = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '24px 0 12px',
  color: '#111827',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const itemsContainer = {
  margin: '24px 0',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '16px',
};

const itemRow = {
  padding: '8px 0',
  borderBottom: '1px solid #e5e7eb',
};

const itemText = {
  color: '#374151',
  fontSize: '16px',
  margin: '0',
};

const itemPrice = {
  float: 'right' as const,
  fontWeight: 'bold',
};

const summaryContainer = {
  margin: '24px 0',
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '4px',
};

const summaryRow = {
  color: '#374151',
  fontSize: '16px',
  margin: '8px 0',
};

const summaryTotal = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 0',
  paddingTop: '16px',
  borderTop: '1px solid #e5e7eb',
};

const summaryValue = {
  float: 'right' as const,
};

const addressContainer = {
  margin: '24px 0',
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '4px',
};

const addressText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

const button = {
  backgroundColor: '#ef4444',
  borderRadius: '6px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '1',
  padding: '16px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  marginTop: '24px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '32px 0 16px',
};