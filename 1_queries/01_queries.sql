-- Validation of user login
SELECT * FROM users WHERE email = 'tristanjacobs@gmail.com';

-- Determining the average length of reservations
SELECT avg(end_date - start_date) as average_duration FROM reservations;

-- Selecting property listings by city
SELECT p.id, p.title, p.cost_per_night, avg(pr.rating) as average_rating
FROM properties as p
JOIN property_reviews as pr ON p.id = pr.property_id
WHERE p.city like '%ancouver%'
GROUP BY p.id
HAVING avg(pr.rating) >= 4
ORDER BY p.cost_per_night
LIMIT 10;

-- Determining the most visited cities
SELECT p.city, count(r.id) as total_reservations
FROM properties as p
JOIN reservations as r ON p.id = r.property_id
GROUP BY p.city
ORDER BY total_reservations DESC;

-- Showing a user all of their reservations, if they are logged in. e.g. user's id is 1.
SELECT r.id, p.title, r.start_date, p.cost_per_night, avg(pr.rating) as average_rating
FROM reservations as r
JOIN properties as p ON r.property_id = p.id
JOIN property_reviews as pr ON p.id = pr.property_id
WHERE r.guest_id = 1
GROUP BY r.id, p.id
ORDER BY r.start_date
LIMIT 10;
