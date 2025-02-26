INSERT INTO licenses (id, name, description, url) VALUES
('cc-by', 'CC BY 4.0', 'Creative Commons Attribution 4.0 International', 'https://creativecommons.org/licenses/by/4.0/'),
('cc-by-sa', 'CC BY-SA 4.0', 'Creative Commons Attribution-ShareAlike 4.0 International', 'https://creativecommons.org/licenses/by-sa/4.0/'),
('cc-by-nc', 'CC BY-NC 4.0', 'Creative Commons Attribution-NonCommercial 4.0 International', 'https://creativecommons.org/licenses/by-nc/4.0/'),
('cc-by-nd', 'CC BY-ND 4.0', 'Creative Commons Attribution-NoDerivatives 4.0 International', 'https://creativecommons.org/licenses/by-nd/4.0/'),
('cc-by-nc-sa', 'CC BY-NC-SA 4.0', 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International', 'https://creativecommons.org/licenses/by-nc-sa/4.0/'),
('cc-by-nc-nd', 'CC BY-NC-ND 4.0', 'Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International', 'https://creativecommons.org/licenses/by-nc-nd/4.0/'),
('cc0', 'CC0 1.0', 'Creative Commons Zero v1.0 Universal', 'https://creativecommons.org/publicdomain/zero/1.0/'),
('public-domain', 'Public Domain', 'Work is in the public domain', NULL),
('publisher-specific', 'Publisher Specific', 'License specific to the publisher', NULL)
ON CONFLICT (id) DO NOTHING;
