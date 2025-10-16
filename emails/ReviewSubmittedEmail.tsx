import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';

interface ReviewSubmittedEmailProps {
  userName: string;
  productName: string;
  rating: number;
  reviewContent: string;
  productUrl: string;
}

export default function ReviewSubmittedEmail({
  userName,
  productName,
  rating,
  reviewContent,
  productUrl,
}: ReviewSubmittedEmailProps) {
  const previewText = `Thank you for reviewing ${productName}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Container style={container}>
        <Section style={section}>
          <Text style={heading}>Thanks for Your Review!</Text>
          <Text style={text}>
            Hi {userName},
          </Text>
          <Text style={text}>
            Thank you for taking the time to review {productName}. Your {rating}-star review has been submitted successfully:
          </Text>
          <Section style={reviewSection}>
            <Text style={reviewText}>&ldquo;{reviewContent}&rdquo;</Text>
          </Section>
          <Text style={text}>
            Your review helps other shoppers make informed decisions and helps us improve our products and services.
          </Text>
          <Button
            href={productUrl}
            style={button}
          >
            View Your Review
          </Button>
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

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const reviewSection = {
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  padding: '16px 24px',
  margin: '24px 0',
};

const reviewText = {
  color: '#4b5563',
  fontSize: '16px',
  fontStyle: 'italic',
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