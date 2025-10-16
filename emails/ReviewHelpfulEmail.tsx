import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';

interface ReviewHelpfulEmailProps {
  userName: string;
  productName: string;
  reviewContent: string;
  helpfulCount: number;
  productUrl: string;
}

export default function ReviewHelpfulEmail({
  userName,
  productName,
  reviewContent,
  helpfulCount,
  productUrl,
}: ReviewHelpfulEmailProps) {
  const previewText = `Your review of ${productName} is helping others!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Container style={container}>
        <Section style={section}>
          <Text style={heading}>Your Review is Helping Others!</Text>
          <Text style={text}>
            Hi {userName},
          </Text>
          <Text style={text}>
            Great news! Your review of {productName} has been marked as helpful by {helpfulCount} {helpfulCount === 1 ? 'person' : 'people'}:
          </Text>
          <Section style={reviewSection}>
            <Text style={reviewText}>&ldquo;{reviewContent}&rdquo;</Text>
          </Section>
          <Text style={text}>
            Thank you for contributing to our community and helping other shoppers make informed decisions.
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