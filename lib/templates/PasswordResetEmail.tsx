import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import type { PasswordResetEmailProps } from '@/lib/email-types';

export default function PasswordResetEmail({
  name,
  resetUrl,
  expiresIn,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your SYBAU password</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <img
                src="https://your-domain.com/logo.png"
                width="170"
                height="50"
                alt="SYBAU"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Reset Your Password
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              We received a request to reset your SYBAU password. Click the button below to choose a new password:
            </Text>
            
            <Button
              className="bg-black rounded text-white font-bold text-center py-[12px] px-[20px] no-underline text-[12px] mt-[32px] mb-[12px]"
              href={resetUrl}
            >
              Reset Password
            </Button>
            
            <Text className="text-black text-[14px] leading-[24px]">
              This password reset link will expire in {expiresIn}.
            </Text>
            
            <Text className="text-black text-[14px] leading-[24px]">
              If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.
            </Text>
            
            <Hr className="my-[26px] mx-0" />
            
            <Text className="text-[12px] text-gray-500 leading-[24px]">
              For security, this request was received from [IP_ADDRESS]. If you have any concerns, please{' '}
              <Link href="https://your-domain.com/contact" className="text-blue-600 underline">
                contact our support team
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}