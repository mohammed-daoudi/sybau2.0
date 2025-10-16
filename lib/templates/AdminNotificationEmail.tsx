import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface AdminNotificationEmailProps {
  message: string;
}

export default function AdminNotificationEmail({
  message,
}: AdminNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>SYBAU Admin Notification</Preview>
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
              Admin Notification
            </Heading>
            
            <Text className="text-black text-[14px] leading-[24px] whitespace-pre-wrap">
              {message}
            </Text>
            
            <Hr className="my-[26px] mx-0" />
            
            <Text className="text-[12px] text-gray-500 text-center">
              This is an automated message from the SYBAU system.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}