// web/src/templates/OrderStatusEmail.tsx
import { Body, Container, Head, Heading, Html, Section, Text } from '@react-email/components';

interface OrderStatusEmailProps {
  name: string;
  status: 'paid' | 'shipped' | 'delivered';
}

const messages = {
  paid: 'Seu pagamento foi confirmado! Estamos preparando seu pedido.',
  shipped: 'Seu pedido foi enviado! Em breve estará em suas mãos.',
  delivered: 'Seu pedido foi entregue com sucesso! Aproveite!',
};

export default function OrderStatusEmail({ name, status }: OrderStatusEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
        <Container style={{ margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <Heading style={{ fontSize: '24px', color: '#111827' }}>Clash Cards</Heading>
          <Text>Olá, {name}!</Text>
          <Text>{messages[status]}</Text>
          <Section style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <Text style={{ fontSize: '12px', color: '#6b7280' }}>Esta é uma mensagem automática. Por favor, não responda.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}