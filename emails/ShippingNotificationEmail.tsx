import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';

interface ShippingNotificationProps {
  orderNumber: string;
  userName: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export default function ShippingNotificationEmail({
  orderNumber,
  userName,
  trackingNumber,
  trackingUrl,
  estimatedDelivery,
  shippingAddress,
  items,
}: ShippingNotificationProps) {
  const previewText = `Your SYBAU order #${orderNumber} has been shipped!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Container style={container}>
        <Section style={section}>
          <Text style={heading}>Your Order Is On Its Way!</Text>
          
          <Text style={text}>
            Hi {userName},
          </Text>
          
          <Text style={text}>
            Great news! Your SYBAU order #{orderNumber} has been shipped and is on its way to you.
          </Text>

          <Section style={trackingSection}>
            <Text style={subheading}>Tracking Information</Text>
            <Text style={trackingInfo}>
              Tracking Number: {trackingNumber}<br />
              Estimated Delivery: {estimatedDelivery}
            </Text>
            <Button href={trackingUrl} style={button}>
              Track Your Package
            </Button>
          </Section>

          <Section style={detailsSection}>
            <Text style={subheading}>Shipping Address</Text>
            <Text style={addressText}>
              {shippingAddress.street}<br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}<br />
              {shippingAddress.country}
            </Text>
          </Section>

          <Section style={detailsSection}>
            <Text style={subheading}>Order Summary</Text>
            {items.map((item, index) => (
              <Text key={index} style={itemText}>
                {item.quantity}x {item.name}
              </Text>
            ))}
          </Section>

          <Text style={text}>
            We'll send you another email once your package has been delivered.
          </Text>

          <Text style={footerText}>
            Having trouble? You can also track your order by copying and pasting this link:<br />
            <Link href={trackingUrl} style={linkText}>{trackingUrl}</Link>
          </Text>

          <Text style={text}>
            Thank you for shopping with SYBAU!<br />
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
  margin: '0 0 16px',
  color: '#111827',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const trackingSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
  padding: '24px',
  margin: '24px 0',
};

const trackingInfo = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  fontFamily: 'monospace',
};

const detailsSection = {
  borderTop: '1px solid #e5e7eb',
  margin: '24px 0',
  paddingTop: '24px',
};

const addressText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

const itemText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '4px 0',
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
  marginTop: '16px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '32px 0 16px',
};

const linkText = {
  color: '#ef4444',
  textDecoration: 'none',
  wordBreak: 'break-all' as const,
};