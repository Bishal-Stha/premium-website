import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface BookingConfirmationProps {
  customerName?: string;
  destinationName?: string;
  bookingDate?: string;
}

export const BookingConfirmation = ({
  customerName = 'Explorer',
  destinationName = 'The Himalayas',
  bookingDate = 'TBD',
}: BookingConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Discover Nepal expedition inquiry has been received</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src="https://discovernepaltours.vercel.app/logo.png"
              width="64"
              height="64"
              alt="Discover Nepal"
              style={logo}
            />
            <Text style={brandName}>DISCOVER NEPAL</Text>
          </Section>

          <Heading style={heading}>Namaste, {customerName}</Heading>

          <Text style={paragraph}>
            Thank you for reaching out to <strong>Discover Nepal</strong>. We are thrilled to welcome you to the threshold of the Himalayas. We have successfully received your inquiry and our team is already at work.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>EXPEDITION DETAILS</Text>
            <Hr style={cardDivider} />
            <Text style={cardItem}>
              <strong>Destination:</strong> {destinationName}
            </Text>
            <Text style={cardItem}>
              <strong>Desired Start Date:</strong> {bookingDate}
            </Text>
            <Text style={cardItem}>
              <strong>Status:</strong> Under Specialist Review
            </Text>
          </Section>

          <Text style={paragraph}>
            Our mountain guides and concierge team are currently reviewing your requested dates, seasonal acclimatization windows, and local lodge allocations.
          </Text>

          <Text style={paragraph}>
            A dedicated expedition specialist will contact you directly within 24 hours with a custom day-by-day itinerary and answers to any questions you may have.
          </Text>

          <Hr style={divider} />

          <Text style={footerHeading}>HAVE QUESTIONS IN THE MEANTIME?</Text>
          <Text style={footerText}>
            Reach out directly to our 24/7 Kathmandu operations desk at{' '}
            <a href="mailto:concierge@discovernepal.example.com" style={link}>
              concierge@discovernepal.example.com
            </a>{' '}
            or call +977 1 4400000.
          </Text>

          <Text style={signoff}>
            Warm regards from the roof of the world,<br />
            <strong>The Discover Nepal Expedition Team</strong><br />
            <span style={address}>123 Thamel Marg, Kathmandu, Nepal</span>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmation;

// Styles
const main: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  color: '#e5e5e5',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: '40px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#121212',
  border: '1px solid #27272a',
  borderRadius: '16px',
  margin: '0 auto',
  padding: '40px 32px',
  maxWidth: '580px',
};

const logoSection: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const logo: React.CSSProperties = {
  margin: '0 auto',
  display: 'block',
};

const brandName: React.CSSProperties = {
  fontSize: '12px',
  letterSpacing: '0.3em',
  color: '#a1a1aa',
  textTransform: 'uppercase' as const,
  marginTop: '12px',
  fontWeight: 600,
  textAlign: 'center' as const,
};

const heading: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 'bold',
  color: '#ffffff',
  textAlign: 'left' as const,
  marginTop: '16px',
  marginBottom: '20px',
  letterSpacing: '-0.02em',
};

const paragraph: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#d4d4d8',
  marginBottom: '16px',
};

const card: React.CSSProperties = {
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

const cardTitle: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.2em',
  color: '#a1a1aa',
  fontWeight: 700,
  margin: '0 0 10px 0',
};

const cardDivider: React.CSSProperties = {
  borderColor: '#27272a',
  margin: '0 0 14px 0',
};

const cardItem: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#f4f4f5',
  margin: '6px 0',
};

const divider: React.CSSProperties = {
  borderColor: '#27272a',
  margin: '32px 0 24px 0',
};

const footerHeading: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.2em',
  color: '#71717a',
  fontWeight: 700,
  marginBottom: '8px',
};

const footerText: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: '1.5',
  color: '#a1a1aa',
  marginBottom: '20px',
};

const link: React.CSSProperties = {
  color: '#ffffff',
  textDecoration: 'underline',
};

const signoff: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#a1a1aa',
  marginTop: '24px',
};

const address: React.CSSProperties = {
  fontSize: '12px',
  color: '#71717a',
};
