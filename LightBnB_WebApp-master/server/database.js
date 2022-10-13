const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const query = (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params)
    .then(result => {
      const duration = Date.now() - start;
      console.log('executed query', { text, duration, params, rows: result.rowCount });
      return callback(result);
    })
    .catch(err => console.log(err.message));
};

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
 const getUserWithEmail = function(email) {
  return query(`SELECT * FROM users WHERE email=$1`, [email], result => result.rows[0]);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return query(`SELECT * FROM users WHERE id=$1`, [id], result => result.rows[0]);
}
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const queryValue = [user.name, user.password, user.email];
  return query(`INSERT INTO users (name, password, email) values ($1, $2, $3) RETURNING *;`, queryValue, result => result.rows[0]);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return query(`
SELECT r.*, p.* FROM reservations AS r
JOIN properties AS p ON p.id = r.property_id
WHERE r.guest_id = $1
LIMIT $2
  `, [guest_id, limit], result => result.rows);
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
  SELECT p.*, avg(pr.rating) AS average_rating
  FROM properties AS p
  FULL OUTER JOIN property_reviews AS pr ON p.id = pr.property_id
  `;

  let havingClause = ''

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE p.city ILIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    const whereOrAnd = queryParams.length > 0 ? 'AND' : 'WHERE';
    queryParams.push(options.owner_id);
    queryString += `${whereOrAnd} p.owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    const whereOrAnd = queryParams.length > 0 ? 'AND' : 'WHERE';
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `${whereOrAnd} p.cost_per_night >= $${queryParams.length} `;
  }

  if (options. maximum_price_per_night) {
    const whereOrAnd = queryParams.length > 0 ? 'AND' : 'WHERE';
    queryParams.push(options. maximum_price_per_night * 100);
    queryString += `${whereOrAnd} p.cost_per_night <= $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    havingClause = `HAVING avg(pr.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY p.id
  ${havingClause}
  ORDER BY p.cost_per_night
  LIMIT $${queryParams.length};
  `;

  return query(queryString, queryParams, result => result.rows);
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

  return query(`
  INSERT INTO properties
  (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `, queryValues, result => result.rows);
}
exports.addProperty = addProperty;
