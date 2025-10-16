import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';

interface AdminNotificationProps {
  adminName: string;
  notificationType: 'alert' | 'warning' | 'info';
  subject: string;
  message: string;
  timestamp: string;
  actionRequired?: boolean;
  actionLink?: string;
  additionalDetails?: {
    label: string;
    value: string;
  }[];
}

export default function AdminNotificationEmail({
  adminName,
  notificationType,
  subject,
  message,
  timestamp,
  actionRequired = false,
  actionLink,
  additionalDetails = [],
}: AdminNotificationProps) {
  const previewText = `${notificationType.toUpperCase()}: ${subject}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Container style={container}>
        <Section style={section}>
          <Text style={{
            ...alertBanner,
            backgroundColor: getAlertColor(notificationType),
          }}>
            {notificationType.toUpperCase()}
          </Text>

          <Text style={heading}>{subject}</Text>
          
          <Text style={text}>
            Hi {adminName},
          </Text>

          <Text style={messageText}>
            {message}
          </Text>

          {actionRequired && actionLink && (
            <Section style={actionSection}>
              <Text style={warningText}>
                ⚠️ Action Required
              </Text>
              <Text style={text}>
                Please review and take necessary action:
              </Text>
              <Link href={actionLink} style={actionLinkStyle}>
                View Details →
              </Link>
            </Section>
          )}

          {additionalDetails.length > 0 && (
            <Section style={detailsSection}>
              <Text style={subheading}>Additional Information</Text>
              {additionalDetails.map((detail, index) => (
                <Text key={index} style={detailText}>
                  <strong>{detail.label}:</strong> {detail.value}
                </Text>
              ))}
            </Section>
          )}

          <Text style={timestampText}>
            Notification sent: {timestamp}
          </Text>

          <Text style={footerText}>
            This is an automated message from the SYBAU system monitoring service.
            Please do not reply to this email.
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

const getAlertColor = (type: 'alert' | 'warning' | 'info') => {
  switch (type) {
    case 'alert':
      return '#ef4444';
    case 'warning':
      return '#f59e0b';
    case 'info':
      return '#3b82f6';
    default:
      return '#6b7280';
  }
};

const container = {
  backgroundColor: '#f5f5f5',
  padding: '40px 0',
};

const section = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '0 0 40px',
};

const alertBanner = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 40px',
  textAlign: 'center' as const,
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  margin: '0 0 32px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 40px 24px',
  color: '#111827',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 40px 16px',
};

const messageText = {
  ...text,
  backgroundColor: '#f9fafb',
  padding: '24px',
  margin: '24px 40px',
  borderRadius: '6px',
};

const subheading = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  color: '#111827',
};

const actionSection = {
  borderTop: '1px solid #e5e7eb',
  margin: '24px 40px',
  paddingTop: '24px',
};

const warningText = {
  color: '#ef4444',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const detailsSection = {
  borderTop: '1px solid #e5e7eb',
  margin: '24px 40px',
  paddingTop: '24px',
};

const detailText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const timestampText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '32px 40px 16px',
  fontFamily: 'monospace',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '32px 40px 0',
  textAlign: 'center' as const,
};

const actionLinkStyle = {
  color: '#ef4444',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
};