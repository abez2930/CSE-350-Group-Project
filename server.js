const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "1234",
    database: "weather_data"
};

let db;

async function initializeDatabase() {
    db = await mysql.createPool(dbConfig);

    console.log("Connected to MySQL");
}

app.get("/test-db", async (req, res) => {

    try {

        const [rows] = await db.execute(
            "SELECT * FROM Cities LIMIT 5"
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).send(error.message);

    }
});

initializeDatabase()
    .then(() => {

        app.listen(3000, () => {
            console.log(
                "Server running at http://localhost:3000"
            );
        });

    })
    .catch(console.error);