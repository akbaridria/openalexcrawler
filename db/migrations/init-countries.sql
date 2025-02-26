INSERT INTO countries (id, name) VALUES
('US', 'United States'),
('GB', 'United Kingdom'),
('DE', 'Germany'),
('FR', 'France'),
('IT', 'Italy'),
('ES', 'Spain'),
('CN', 'China'),
('JP', 'Japan'),
('CA', 'Canada'),
('AU', 'Australia')
ON CONFLICT (id) DO NOTHING;
