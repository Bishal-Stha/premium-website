-- Lead Capture Schema
CREATE TABLE booking_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    destination_slug VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE booking_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert on booking_inquiries"
    ON booking_inquiries FOR INSERT
    TO anon
    WITH CHECK (true);

GRANT INSERT ON booking_inquiries TO anon, authenticated;

-- Testimonials Schema
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INT DEFAULT 5
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read access on testimonials"
    ON testimonials FOR SELECT
    TO anon
    USING (true);

GRANT SELECT ON testimonials TO anon, authenticated;

INSERT INTO testimonials (author, location, content, rating) VALUES
('Sarah J.', 'Everest Base Camp', 'An absolutely life-changing experience. The guides were exceptionally knowledgeable and the mountain views were unmatched.', 5),
('David M.', 'Annapurna Circuit', 'Seamlessly organized from start to finish. The cultural immersion in the hilly regions gave us memories for a lifetime.', 5),
('Emma R.', 'Chitwan Safaris', 'Seeing rhinos in the wild was thrilling! The luxury eco-lodge stay combined with expert wildlife tracking exceeded all expectations.', 5);
