import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import ReviewSubmittedEmail from '@/emails/ReviewSubmittedEmail';
import ReviewHelpfulEmail from '@/emails/ReviewHelpfulEmail';
import type { User, Review, Product } from '@/lib/types';

interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendReviewSubmittedEmail(user: User, review: Review, product: Product) {
  try {
    const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug}#review-${review._id}`;

    const emailHtml = await render(
      ReviewSubmittedEmail({
        userName: user.name,
        productName: product.title,
        rating: review.rating,
        reviewContent: review.content,
        productUrl,
      })
    );

    const emailConfig: EmailConfig = {
      from: `"SYBAU" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: `Thanks for reviewing ${product.title}!`,
      html: emailHtml,
    };

    await transporter.sendMail(emailConfig);
    console.log('Review submission email sent successfully');
  } catch (error) {
    console.error('Error sending review submission email:', error);
  }
}

export async function sendReviewHelpfulEmail(user: User, review: Review, product: Product) {
  try {
    const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug}#review-${review._id}`;
    const helpfulCount = review.helpful.length;

    // Only send email for certain milestones (1, 5, 10, 25, 50, 100, etc.)
    const milestones = [1, 5, 10, 25, 50, 100];
    if (!milestones.includes(helpfulCount)) {
      return;
    }

    const emailHtml = await render(
      ReviewHelpfulEmail({
        userName: user.name,
        productName: product.title,
        reviewContent: review.content,
        helpfulCount,
        productUrl,
      })
    );

    const emailConfig: EmailConfig = {
      from: `"SYBAU" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: `Your review of ${product.title} is helping others!`,
      html: emailHtml,
    };

    await transporter.sendMail(emailConfig);
    console.log('Review helpful email sent successfully');
  } catch (error) {
    console.error('Error sending review helpful email:', error);
  }
}