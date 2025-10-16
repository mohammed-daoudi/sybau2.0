import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';

interface PasswordResetEmailProps {
  userName: string;
  resetLink: string;
  requestedAt: string;
  expiresAt: string;
}

export default function PasswordResetEmail({
  userName,
  resetLink,
  requestedAt,
  expiresAt,
}: PasswordResetEmailProps) {
  const previewText = 'Reset your SYBAU password';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Container style={container}>
        <Section style={section}>
          <Text style={heading}>Password Reset Request</Text>
          <Text style={text}>
            Hi {userName},
          </Text>
          <Text style={text}>
            We received a request to reset your SYBAU account password. Click the button below to choose a new password:
          </Text>

          <Button href={resetLink} style={button}>
            Reset Password
          </Button>

          <Text style={warningText}>
            This password reset link will expire at {expiresAt}.
          </Text>

          <Text style={text}>
            For security reasons, this request will expire after 1 hour. If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.
          </Text>

          <Section style={infoBox}>
            <Text style={infoText}>
              Request Details:<br />
              Requested At: {requestedAt}<br />
              Expires At: {expiresAt}
            </Text>
          </Section>

          <Text style={footerText}>
            If the button above doesn't work, copy and paste this link into your browser:<br />
            <Link href={resetLink} style={linkText}>{resetLink}</Link>
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

const infoBox = {
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
};

const infoText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
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