-- Stage 9: UX Polish & Guest Booking Management
-- Add booking_reference column to booking_inquiries

ALTER TABLE booking_inquiries
ADD COLUMN IF NOT EXISTS booking_reference UUID DEFAULT gen_random_uuid();

-- Backfill any existing rows
UPDATE booking_inquiries
SET booking_reference = gen_random_uuid()
WHERE booking_reference IS NULL;

-- Enforce UNIQUE and NOT NULL
ALTER TABLE booking_inquiries
ALTER COLUMN booking_reference SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'booking_inquiries_booking_reference_key'
  ) THEN
    ALTER TABLE booking_inquiries
    ADD CONSTRAINT booking_inquiries_booking_reference_key UNIQUE (booking_reference);
  END IF;
END $$;

-- RPC: Secure Guest Lookup by Email and Booking Reference
CREATE OR REPLACE FUNCTION get_guest_booking(p_email TEXT, p_reference UUID)
RETURNS TABLE (
  id UUID,
  booking_reference UUID,
  name VARCHAR,
  email VARCHAR,
  destination_slug VARCHAR,
  date DATE,
  status TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.booking_reference,
    b.name,
    b.email,
    b.destination_slug,
    b.date,
    b.status,
    b.created_at
  FROM booking_inquiries b
  WHERE LOWER(TRIM(b.email)) = LOWER(TRIM(p_email))
    AND b.booking_reference = p_reference
  LIMIT 1;
END;
$$;

-- RPC: Secure Guest Date Modification by Email and Booking Reference
CREATE OR REPLACE FUNCTION update_guest_booking_date(p_email TEXT, p_reference UUID, p_new_date DATE)
RETURNS TABLE (
  id UUID,
  booking_reference UUID,
  name VARCHAR,
  email VARCHAR,
  destination_slug VARCHAR,
  date DATE,
  status TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE booking_inquiries b
  SET date = p_new_date
  WHERE LOWER(TRIM(b.email)) = LOWER(TRIM(p_email))
    AND b.booking_reference = p_reference
  RETURNING
    b.id,
    b.booking_reference,
    b.name,
    b.email,
    b.destination_slug,
    b.date,
    b.status,
    b.created_at;
END;
$$;

GRANT EXECUTE ON FUNCTION get_guest_booking(TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_guest_booking_date(TEXT, UUID, DATE) TO anon, authenticated;
