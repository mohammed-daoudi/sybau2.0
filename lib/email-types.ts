import type { Address } from './types';

interface BaseEmailProps {
  email: string;
  name: string;
}

export interface OrderConfirmationEmailProps extends BaseEmailProps {
  orderId: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    variant?: {
      name: string;
      value: string;
    };
  }>;
  total: number;
  shippingAddress: Address;
  estimatedDelivery: string;
}

export interface PasswordResetEmailProps extends BaseEmailProps {
  resetToken: string;
  resetUrl: string;
  expiresIn: string;
}

export interface AccountVerificationEmailProps extends BaseEmailProps {
  verificationToken: string;
  verificationUrl: string;
  expiresIn: string;
}

export interface ShippingNotificationEmailProps extends BaseEmailProps {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
  estimatedDelivery: string;
  shippingAddress: Address;
}

// For TypeScript support in the email templates
declare global {
  namespace JSX {
    interface IntrinsicElements {
      body: any;
      head: any;
      html: any;
      preview: any;
      container: any;
      text: any;
      link: any;
      img: any;
      hr: any;
      button: any;
      section: any;
      table: any;
      tr: any;
      td: any;
      th: any;
    }
  }
}