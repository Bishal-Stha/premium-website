-- Create the scroll_chapters table
CREATE TABLE scroll_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    frame_start INT NOT NULL,
    frame_end INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE scroll_chapters ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access on scroll_chapters"
    ON scroll_chapters FOR SELECT
    TO public
    USING (true);

-- Insert dummy data matching geographical transitions with estimated frames out of 240
INSERT INTO scroll_chapters (title, description, frame_start, frame_end) VALUES
('The Himalayas', 'Snow-capped peaks piercing the sky, representing the majestic high altitudes of Nepal.', 0, 59),
('The Hilly Region', 'Terraced hillsides and vibrant green valleys, the heartland of the nation.', 60, 119),
('The Raging Rivers', 'Whitewater coursing through deep gorges, carving paths down from the mountains.', 120, 179),
('The Terai Plains', 'Golden flatlands and dense jungles, home to diverse wildlife and rich agriculture.', 180, 240);
