# LightBnB Project

LightBnB is a simple AirBnB clone.

## Final Product
### Top Page View
!["Screenshot of top page View"](https://github.com/atyoshimatsu/LightBnB/blob/main/LightBnB_WebApp-master/blob/LightBnB_top_paage.png)


## Getting Started
1. Clone your repository onto your local device.
2. Login your local psql and `CREATE DATABASE lightbnb`
3. Migrate schemas `\i migrations/01_schemas.sql`, `\i migrations/02_schemas.sql`
4. Insert records `\i seeds/02_seeds.sql`
5. Install dependencies using the `cd LightBnB_WebApp-master && npm install` command.
6. Start the web server using the `npm run local` command. The app will be served at <http://localhost:3000/>.
7. Go to <http://localhost:3000/> in your browser.

## Structure
See `LightBnB_WebApp-master/README.md`.
