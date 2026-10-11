-- Stage 7: Admin Dashboard & Lead Management

ALTER TABLE booking_inquiries
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

ALTER TABLE booking_inquiries
ADD CONSTRAINT booking_inquiries_status_check
CHECK (status IN ('pending', 'contacted', 'confirmed', 'archived'));

-- Keep anonymous public visitors insert-only.
DROP POLICY IF EXISTS "Allow anon insert on booking_inquiries" ON booking_inquiries;
CREATE POLICY "Allow anon insert on booking_inquiries"
    ON booking_inquiries FOR INSERT
    TO anon
    WITH CHECK (true);

-- Authenticated admins can read, update, and delete leads.
CREATE POLICY "Allow authenticated read on booking_inquiries"
    ON booking_inquiries FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated update on booking_inquiries"
    ON booking_inquiries FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on booking_inquiries"
    ON booking_inquiries FOR DELETE
    TO authenticated
    USING (true);

GRANT SELECT, UPDATE, DELETE ON booking_inquiries TO authenticated;
