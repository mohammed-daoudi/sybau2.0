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
import type { AccountVerificationEmailProps } from '@/lib/email-types';

export default function AccountVerificationEmail({
  name,
  verificationUrl,
  expiresIn,
}: AccountVerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your SYBAU account</Preview>
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
              Verify Your Account
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Welcome to SYBAU! Please verify your email address to get access to exclusive drops, early access to collections, and member-only benefits.
            </Text>
            
            <Button
              className="bg-black rounded text-white font-bold text-center py-[12px] px-[20px] no-underline text-[12px] mt-[32px] mb-[12px]"
              href={verificationUrl}
            >
              Verify Email
            </Button>
            
            <Text className="text-black text-[14px] leading-[24px]">
              This verification link will expire in {expiresIn}.
            </Text>
            
            <Text className="text-black text-[14px] leading-[24px]">
              If you didn't create an account with us, you can safely ignore this email.
            </Text>
            
            <Hr className="my-[26px] mx-0" />
            
            <Text className="text-[12px] text-gray-500 leading-[24px]">
              Need help? Please{' '}
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