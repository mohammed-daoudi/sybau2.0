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
  Row,
  Column,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import type { OrderConfirmationEmailProps } from '@/lib/email-types';

export default function OrderConfirmationEmail({
  name,
  orderId,
  items,
  total,
  shippingAddress,
  estimatedDelivery,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your SYBAU order confirmation {orderId}</Preview>
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
              Order Confirmation
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thank you for your order! We've received your order and will begin processing it right away.
            </Text>
            
            <Section className="my-[32px]">
              <Row>
                <Column className="font-bold">Order ID:</Column>
                <Column>{orderId}</Column>
              </Row>
              <Hr className="my-[16px] mx-0" />
              
              {items.map((item, index) => (
                <Row key={index} className="my-[8px]">
                  <Column>
                    <Text className="m-0">
                      {item.title}
                      {item.variant && ` - ${item.variant.name}: ${item.variant.value}`}
                    </Text>
                    <Text className="text-gray-500 m-0">
                      Quantity: {item.quantity}
                    </Text>
                  </Column>
                  <Column className="text-right">
                    ${item.price.toFixed(2)}
                  </Column>
                </Row>
              ))}
              
              <Hr className="my-[16px] mx-0" />
              <Row>
                <Column className="font-bold">Total:</Column>
                <Column className="text-right">${total.toFixed(2)}</Column>
              </Row>
            </Section>
            
            <Section className="my-[32px]">
              <Heading className="text-black text-[16px] font-bold m-0">
                Shipping Address
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
              View Order Status
            </Button>
            
            <Hr className="my-[26px] mx-0" />
            
            <Text className="text-[12px] text-gray-500 leading-[24px]">
              This email was sent to {name}. If you have any questions, please{' '}
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