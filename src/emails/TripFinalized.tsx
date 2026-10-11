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

interface TripFinalizedProps {
  customerName?: string;
  destinationName?: string;
  bookingDate?: string;
  estimatedCost?: string;
  bookingReference?: string;
}

export const TripFinalized = ({
  customerName = 'Valued Guest',
  destinationName = 'The Himalayas',
  bookingDate = 'TBD',
  estimatedCost = 'Per Quotation',
  bookingReference,
}: TripFinalizedProps) => {
  return (
    <Html>
      <Head />
      <Preview>Official Confirmation: Your expedition with Discover Nepal is confirmed!</Preview>
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

          <div style={badgeContainer}>
            <span style={badge}>EXPEDITION CONFIRMED</span>
          </div>

          <Heading style={heading}>Welcome Aboard, {customerName}!</Heading>

          <Text style={paragraph}>
            We are honored to officially confirm your upcoming journey to <strong>{destinationName}</strong>. Your mountain guides, permits, and private logistics are now reserved.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>CONFIRMED RESERVATION SUMMARY</Text>
            <Hr style={cardDivider} />
            <Text style={cardItem}>
              <strong>Destination:</strong> {destinationName}
            </Text>
            <Text style={cardItem}>
              <strong>Confirmed Date:</strong> {bookingDate}
            </Text>
            {bookingReference && (
              <Text style={cardItem}>
                <strong>Booking Reference:</strong>{' '}
                <span style={{ fontFamily: 'monospace', color: '#34d399', backgroundColor: '#27272a', padding: '2px 8px', borderRadius: '6px', border: '1px solid #3f3f46' }}>
                  {bookingReference}
                </span>
              </Text>
            )}
            <Text style={cardItem}>
              <strong>Estimated Package:</strong> {estimatedCost}
            </Text>
            <Text style={cardItem}>
              <strong>Status:</strong> <span style={{ color: '#34d399' }}>Official Confirmation Issued</span>
            </Text>
          </Section>

          <Heading as="h3" style={subheading}>Next Steps & Preparation</Heading>

          <Section style={stepsSection}>
            <Text style={stepItem}>
              <strong>1. Trekking Permits & Insurance:</strong> Our operations desk will submit your TIMS permits and national park passes. Please reply to this email with a clear scan of your passport.
            </Text>
            <Text style={stepItem}>
              <strong>2. Gear & Medical Checklist:</strong> We have attached our comprehensive high-altitude equipment guide and packing checklist to ensure you are fully prepared.
            </Text>
            <Text style={stepItem}>
              <strong>3. Pre-Departure Concierge Call:</strong> 14 days before your arrival, your Lead Mountain Guide will connect via video call to review trail conditions and answer any personal requests.
            </Text>
          </Section>

          <Section style={paymentBox}>
            <Text style={paymentTitle}>PAYMENT INSTRUCTIONS (SECURE WIRE)</Text>
            <Text style={paymentNote}>
              To finalize lodge reservations and high-altitude domestic flights, a 30% advance deposit is requested within 5 business days:
            </Text>
            <Text style={paymentDetail}>
              <strong>Beneficiary:</strong> Discover Nepal Luxury Expeditions Pvt. Ltd.<br />
              <strong>Bank:</strong> Himalayan Bank Limited, Kathmandu, Nepal<br />
              <strong>Account / IBAN:</strong> NP00 1234 5678 9012 3456<br />
              <strong>SWIFT / BIC:</strong> HIMALNPKA<br />
              <strong>Reference:</strong> DN-EXP-{customerName.toUpperCase().replace(/\s+/g, '-')}
            </Text>
            <Text style={paymentSubnote}>
              Prefer credit card or online payment? Simply reply to this email to receive a direct 3D-Secure payment link from our concierge.
            </Text>
          </Section>

          <Hr style={divider} />

          <Text style={footerHeading}>NEED IMMEDIATE ASSISTANCE?</Text>
          <Text style={footerText}>
            Your dedicated expedition lead is available 24/7 at{' '}
            <a href="mailto:concierge@discovernepal.example.com" style={link}>
              concierge@discovernepal.example.com
            </a>{' '}
            or via phone / WhatsApp at +977 1 4400000.
          </Text>

          <Text style={signoff}>
            We look forward to standing beneath the peaks together,<br />
            <strong>The Discover Nepal Expedition Team</strong><br />
            <span style={address}>123 Thamel Marg, Kathmandu, Nepal</span>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TripFinalized;

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
  marginBottom: '20px',
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

const badgeContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: '16px',
};

const badge: React.CSSProperties = {
  backgroundColor: 'rgba(52, 211, 153, 0.15)',
  color: '#34d399',
  border: '1px solid rgba(52, 211, 153, 0.3)',
  borderRadius: '9999px',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.15em',
  padding: '4px 14px',
  textTransform: 'uppercase' as const,
  display: 'inline-block',
};

const heading: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 'bold',
  color: '#ffffff',
  textAlign: 'left' as const,
  marginTop: '8px',
  marginBottom: '20px',
  letterSpacing: '-0.02em',
};

const subheading: React.CSSProperties = {
  fontSize: '17px',
  fontWeight: 600,
  color: '#ffffff',
  marginTop: '28px',
  marginBottom: '12px',
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

const stepsSection: React.CSSProperties = {
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '12px',
  padding: '16px 20px',
  margin: '12px 0 24px 0',
};

const stepItem: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: '1.6',
  color: '#d4d4d8',
  margin: '10px 0',
};

const paymentBox: React.CSSProperties = {
  backgroundColor: '#1c1917',
  border: '1px solid #44403c',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

const paymentTitle: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.15em',
  color: '#fbbf24',
  fontWeight: 700,
  margin: '0 0 8px 0',
};

const paymentNote: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: '1.5',
  color: '#e7e5e4',
  marginBottom: '12px',
};

const paymentDetail: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: '1.8',
  color: '#f5f5f4',
  fontFamily: 'monospace',
  backgroundColor: '#0c0a09',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #292524',
  margin: '10px 0',
};

const paymentSubnote: React.CSSProperties = {
  fontSize: '12px',
  color: '#a8a29e',
  marginTop: '10px',
  fontStyle: 'italic',
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
