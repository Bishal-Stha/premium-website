-- Add new columns
ALTER TABLE scroll_chapters ADD COLUMN cta_text VARCHAR(255);
ALTER TABLE scroll_chapters ADD COLUMN cta_link VARCHAR(255);

-- Explicitly grant SELECT to anon and authenticated roles
GRANT SELECT ON scroll_chapters TO anon, authenticated;

-- Ensure policy exists explicitly for anon
DROP POLICY IF EXISTS "Allow public read access on scroll_chapters" ON scroll_chapters;
CREATE POLICY "Allow anon read access on scroll_chapters"
    ON scroll_chapters FOR SELECT
    TO anon
    USING (true);

-- Clear existing data
TRUNCATE TABLE scroll_chapters;

-- Add updated tourism dummy data
INSERT INTO scroll_chapters (title, description, frame_start, frame_end, cta_text, cta_link) VALUES
('The Himalayas', 'Trekking & Mountaineering', 0, 59, 'Explore Expeditions', '/destinations/himalayas'),
('The Hilly Region', 'Culture & Heritage', 60, 119, 'View Cultural Tours', '/destinations/hills'),
('The Raging Rivers', 'White Water Rafting', 120, 179, 'Book an Adventure', '/destinations/rivers'),
('The Terai Plains', 'Wildlife Safaris', 180, 240, 'Discover Chitwan', '/destinations/terai');
