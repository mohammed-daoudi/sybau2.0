import { createTransport } from 'nodemailer';
import { render } from '@react-email/render';
import type { OrderConfirmationEmailProps, PasswordResetEmailProps, AccountVerificationEmailProps, ShippingNotificationEmailProps } from './email-types';

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@sybau.com';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined in environment variables');
}

// Configure nodemailer with SendGrid
const transporter = createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: SENDGRID_API_KEY,
  },
});

// Generic send function with error handling and retries
async function sendEmail({
  to,
  subject,
  html,
  text,
  retries = 3,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  retries?: number;
}): Promise<boolean> {
  let attempt = 0;
  
  while (attempt < retries) {
    try {
      await transporter.sendMail({
        from: EMAIL_FROM,
        to,
        subject,
        html,
        text,
      });
      return true;
    } catch (error) {
      attempt++;
      if (attempt === retries) {
        console.error('Failed to send email after', retries, 'attempts:', error);
        throw error;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  return false;
}

// Email sending functions for different purposes
export async function sendOrderConfirmationEmail(props: OrderConfirmationEmailProps): Promise<boolean> {
  const { OrderConfirmationEmail } = await import('./templates/OrderConfirmationEmail');
  const html = render(OrderConfirmationEmail(props));
  const text = render(OrderConfirmationEmail(props), { plainText: true });
  
  return sendEmail({
    to: props.email,
    subject: `Order Confirmation - #${props.orderId}`,
    html,
    text,
  });
}

export async function sendPasswordResetEmail(props: PasswordResetEmailProps): Promise<boolean> {
  const { PasswordResetEmail } = await import('./templates/PasswordResetEmail');
  const html = render(PasswordResetEmail(props));
  const text = render(PasswordResetEmail(props), { plainText: true });
  
  return sendEmail({
    to: props.email,
    subject: 'Reset Your Password - SYBAU',
    html,
    text,
  });
}

export async function sendAccountVerificationEmail(props: AccountVerificationEmailProps): Promise<boolean> {
  const { AccountVerificationEmail } = await import('./templates/AccountVerificationEmail');
  const html = render(AccountVerificationEmail(props));
  const text = render(AccountVerificationEmail(props), { plainText: true });
  
  return sendEmail({
    to: props.email,
    subject: 'Verify Your Email - SYBAU',
    html,
    text,
  });
}

export async function sendShippingNotificationEmail(props: ShippingNotificationEmailProps): Promise<boolean> {
  const { ShippingNotificationEmail } = await import('./templates/ShippingNotificationEmail');
  const html = render(ShippingNotificationEmail(props));
  const text = render(ShippingNotificationEmail(props), { plainText: true });
  
  return sendEmail({
    to: props.email,
    subject: `Your Order #${props.orderId} Has Shipped`,
    html,
    text,
  });
}

export async function sendAdminNotificationEmail(subject: string, message: string, adminEmail: string): Promise<boolean> {
  const { AdminNotificationEmail } = await import('./templates/AdminNotificationEmail');
  const html = render(AdminNotificationEmail({ message }));
  const text = message;
  
  return sendEmail({
    to: adminEmail,
    subject: `SYBAU Admin Notification - ${subject}`,
    html,
    text,
  });
}