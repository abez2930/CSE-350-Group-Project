# CSE-350-Group-Project

## Running the application

1. Create the `weather_data` database and `cities` table by running `schema.sql`.
2. Configure the MySQL connection with `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and
   `DB_NAME` environment variables if the local defaults do not match your setup.
3. Install dependencies with `npm install`, import `cities.csv` with
   `node importCities.js`, and start the application with `node server.js`.
4. Open [http://localhost:3000](http://localhost:3000). The server fetches
   observations from the NWS on startup and every 10 minutes; the browser reads
   the latest stored observations from the server.

The server adds the `windSpeed` column and widens the `pressure` column on an
existing `cities` table if needed.