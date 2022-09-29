DELETE FROM property_reviews;
DELETE FROM reservations;
DELETE FROM properties;
DELETE FROM users;

-- users
select setval ('users_id_seq', 1, false);
INSERT INTO users (name, email, password) VALUES ('ATSUYUKI', 'at@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('SATOMI', 'sa@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('TETO', 'te@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- properties
select setval ('properties_id_seq', 1, false);
INSERT INTO properties (
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code,
  active
) VALUES (1, 'ATSU house', 'good house', 'http://thumbnail1.photo', 'http://cover1.photo', 1, 1, 1, 1, 'Canada', '11 Brown Ave', 'Vancouver', 'BC', 'V2K4J1', TRUE),
(2, 'SATO house', 'good house', 'http://thumbnail2.photo', 'http://cover2.photo', 2, 2, 2, 2, 'Canada', '22 Brown Ave', 'Vancouver', 'BC', 'V1K4J2', TRUE),
(3, 'TETO house', 'good house', 'http://thumbnail3.photo', 'http://cover3.photo', 3, 3, 3, 3, 'Canada', '33 Brown Ave', 'Vancouver', 'BC', 'V5K4J3', TRUE);

-- reservatioins
select setval ('reservations_id_seq', 1, false);
INSERT INTO reservations (start_date, end_date, property_id, guest_id) VALUES ('2022-09-01', '2022-09-03', 1, 2),
('2022-09-02', '2022-09-06', 3, 1),
('2022-09-15', '2022-09-22', 2, 3);

-- property-reviews
select setval ('property_reviews_id_seq', 1, false);
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES (3, 2, 1, 3, 'message'),
(2, 2, 2, 4, 'message'),
(3, 1, 3, 4, 'message');
