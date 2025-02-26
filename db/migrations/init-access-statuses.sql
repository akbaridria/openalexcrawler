INSERT INTO access_statuses (id, name, description) VALUES
(0, 'diamond', 'Published in a fully OA journal—one that is indexed by the DOAJ or that we have determined to be OA—with no article processing charges (i.e., free for both readers and authors).'),
(1, 'gold', 'Published in a fully OA journal.'),
(2, 'green', 'Toll-access on the publisher landing page, but there is a free copy in an OA repository.'),
(3, 'hybrid', 'Free under an open license in a toll-access journal.'),
(4, 'bronze', ' Free to read on the publisher landing page, but without any identifiable license.'),
(5, 'closed', 'All other articles.')
ON CONFLICT (id) DO NOTHING;
