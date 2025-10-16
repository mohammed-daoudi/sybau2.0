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
import type { ShippingNotificationEmailProps } from '@/lib/email-types';

export default function ShippingNotificationEmail({
  name,
  orderId,
  trackingNumber,
  carrier,
  trackingUrl,
  estimatedDelivery,
  shippingAddress,
}: ShippingNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your SYBAU order #{orderId} has shipped!</Preview>
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
              Your Order Has Shipped!
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Great news! Your order #{orderId} is on its way.
            </Text>
            
            <Section className="my-[32px]">
              <Heading className="text-black text-[16px] font-bold m-0">
                Tracking Information
              </Heading>
              <Text className="text-black text-[14px] leading-[24px] m-0">
                Carrier: {carrier}
                <br />
                Tracking Number: {trackingNumber}
              </Text>
              <Button
                className="bg-black rounded text-white font-bold text-center py-[12px] px-[20px] no-underline text-[12px] mt-[16px]"
                href={trackingUrl}
              >
                Track Package
              </Button>
            </Section>
            
            <Section className="my-[32px]">
              <Heading className="text-black text-[16px] font-bold m-0">
                Delivery Address
              </Heading>
              <Text className="text-black text-[14px] leading-[24px] m-0">
                {shippingAddress.name}
                <br />
                {shippingAddress.street}
                <br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                <br />
                {shippingAddress.country}
              </Text>
            </Section>
            
            <Text className="text-black text-[14px] leading-[24px]">
              Estimated delivery: {estimatedDelivery}
            </Text>
            
            <Button
              className="bg-black rounded text-white font-bold text-center py-[12px] px-[20px] no-underline text-[12px] mt-[32px] mb-[12px]"
              href={`https://your-domain.com/orders/${orderId}`}
            >
              View Order Details
            </Button>
            
            <Hr className="my-[26px] mx-0" />
            
            <Text className="text-[12px] text-gray-500 leading-[24px]">
              Need help with your delivery? Please{' '}
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