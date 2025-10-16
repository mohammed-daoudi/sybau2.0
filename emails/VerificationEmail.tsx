import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';

interface VerificationEmailProps {
  userName: string;
  verificationLink: string;
  expiresAt: string;
}

export default function VerificationEmail({
  userName,
  verificationLink,
  expiresAt,
}: VerificationEmailProps) {
  const previewText = 'Verify your SYBAU account';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Container style={container}>
        <Section style={section}>
          <Text style={heading}>Welcome to SYBAU!</Text>
          <Text style={text}>
            Hi {userName},
          </Text>
          <Text style={text}>
            Thanks for signing up! To complete your registration and unlock all features of your SYBAU account, please verify your email address:
          </Text>

          <Button href={verificationLink} style={button}>
            Verify Email Address
          </Button>

          <Text style={warningText}>
            This verification link will expire at {expiresAt}.
          </Text>

          <Text style={text}>
            By verifying your email, you'll get:
          </Text>

          <ul style={benefitsList}>
            <li style={benefitItem}>Access to exclusive drops and pre-sales</li>
            <li style={benefitItem}>Order tracking and history</li>
            <li style={benefitItem}>Personalized recommendations</li>
            <li style={benefitItem}>Special offers and updates</li>
          </ul>

          <Text style={footerText}>
            If the button above doesn't work, copy and paste this link into your browser:<br />
            <Link href={verificationLink} style={linkText}>{verificationLink}</Link>
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

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
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
  marginBottom: '24px',
};

const warningText = {
  color: '#ef4444',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '24px 0',
};

const benefitsList = {
  margin: '16px 0',
  paddingLeft: '20px',
};

const benefitItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
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