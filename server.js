const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = 3000;
const WEATHER_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

app.use(express.json());
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/weatherData.js", (req, res) => {
    res.sendFile(path.join(__dirname, "weatherData.js"));
});
app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "style.css"));
});

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "weather_data"
};

let db;
let refreshInProgress = false;

async function ensureWeatherColumns() {
    const [columns] = await db.execute("SHOW COLUMNS FROM cities LIKE 'windSpeed'");

    if (columns.length === 0) {
        await db.execute(
            "ALTER TABLE cities ADD COLUMN windSpeed DECIMAL(7,2) DEFAULT NULL"
        );
    }

    const [pressureColumns] = await db.execute(
        "SHOW COLUMNS FROM cities LIKE 'pressure'"
    );

    if (pressureColumns[0]?.Type.toLowerCase() === "decimal(7,2)") {
        await db.execute(
            "ALTER TABLE cities MODIFY pressure DECIMAL(8,2) DEFAULT NULL"
        );
    }
}

async function refreshWeatherData() {
    if (refreshInProgress) {
        console.warn("Skipping weather refresh because the previous refresh is still running.");
        return;
    }

    refreshInProgress = true;

    try {
        const [cities] = await db.execute(
            "SELECT id, station FROM cities WHERE station IS NOT NULL AND station <> ''"
        );

        for (const city of cities) {
            try {
                const response = await fetch(
                    `https://api.weather.gov/stations/${encodeURIComponent(city.station)}/observations/latest`,
                    {
                        headers: {
                            Accept: "application/geo+json",
                            "User-Agent": "WeatherNow/1.0"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`NWS returned HTTP ${response.status}`);
                }

                const observation = await response.json();
                const properties = observation.properties;

                if (!properties) {
                    throw new Error("NWS response did not contain observation properties");
                }

                await db.execute(
                    `UPDATE cities
                     SET temperature = ?, humidity = ?, windDirection = ?,
                         windSpeed = ?, pressure = ?, conditions = ?,
                         querytime = CURRENT_TIMESTAMP
                     WHERE id = ?`,
                    [
                        properties.temperature?.value ?? null,
                        properties.relativeHumidity?.value ?? null,
                        properties.windDirection?.value == null
                            ? null
                            : String(properties.windDirection.value),
                        properties.windSpeed?.value ?? null,
                        properties.barometricPressure?.value ?? null,
                        properties.textDescription || null,
                        city.id
                    ]
                );
            } catch (error) {
                console.error(`Unable to refresh weather for station ${city.station}:`, error);
            }
        }

        console.log(`Weather refresh completed for ${cities.length} cities.`);
    } catch (error) {
        console.error("Unable to refresh weather data:", error);
    } finally {
        refreshInProgress = false;
    }
}

app.get("/api/weather/:cityId", async (req, res) => {
    const cityId = Number(req.params.cityId);

    if (!Number.isInteger(cityId)) {
        res.status(400).json({ error: "City ID must be an integer." });
        return;
    }

    try {
        const [rows] = await db.execute(
            `SELECT id, city, state, station, temperature, humidity,
                    windDirection, windSpeed, pressure, conditions, querytime
             FROM cities
             WHERE id = ?`,
            [cityId]
        );

        if (rows.length === 0) {
            res.status(404).json({ error: "City not found." });
            return;
        }

        if (rows[0].querytime === null) {
            res.status(503).json({ error: "Weather data is not available yet." });
            return;
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Unable to read weather data:", error);
        res.status(500).json({ error: "Unable to read weather data." });
    }
});

async function initializeDatabase() {
    db = await mysql.createPool(dbConfig);
    await ensureWeatherColumns();

    console.log("Connected to MySQL");

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

    void refreshWeatherData();
    setInterval(() => {
        void refreshWeatherData();
    }, WEATHER_REFRESH_INTERVAL_MS);
}

initializeDatabase().catch((error) => {
    console.error("Unable to initialize the server:", error);
    process.exitCode = 1;
});
