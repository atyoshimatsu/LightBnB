const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`SELECT * FROM users WHERE email=$1`, [email])
  .then(result => result.rows[0])
  .catch(err => console.log(err.message));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`SELECT * FROM users WHERE id=$1`, [id])
  .then(result => result.rows[0])
  .catch(err => console.log(err.message));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const queryValue = [user.name, user.password, user.email];
  return pool.query(`INSERT INTO users (name, password, email) values ($1, $2, $3) RETURNING *;`, queryValue)
  .then(result => result.rows[0])
  .catch(err => console.log(err.message));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
SELECT r.*, p.* FROM reservations AS r
JOIN properties AS p ON p.id = r.property_id
WHERE r.guest_id = $1
LIMIT $2
  `, [guest_id, limit])
  .then(result => result.rows)
  .catch(err => err.message);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];

  let queryString = `
  SELECT p.*, avg(pr.rating) AS averae_rating
  FROM properties AS p
  JOIN property_reviews AS pr ON p.id = pr.property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city ILIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    const whereOrAnd = queryParams.length > 0 ? 'WHERE': 'AND';
    queryString += `${whereOrAnd} owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    const whereOrAnd = queryParams.length > 0 ? 'WHERE': 'AND';
    queryString += `${whereOrAnd} minimum_price_per_night >= $${queryParams.length} `;
  }

  if (options. maximum_price_per_night) {
    queryParams.push(options. maximum_price_per_night * 100);
    const whereOrAnd = queryParams.length > 0 ? 'WHERE': 'AND';
    queryString += `${whereOrAnd}  maximum_price_per_night <= $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    const whereOrAnd = queryParams.length > 0 ? 'WHERE': 'AND';
    queryString += `${whereOrAnd} average_rating >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY p.id
  ORDER BY p.cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
  .then(result => result.rows)
  .catch(err => err.message);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryValues = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
  ];

  return pool.query(`
  INSERT INTO properties
  (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `, queryValues)
    .then(result => {
      cosole.log(result.row);
      return result.rows;
    })
    .catch(err => err.message);
}
exports.addProperty = addProperty;
