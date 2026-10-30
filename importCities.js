const fs = require("fs");
const csv = require("csv-parser");
const mysql = require("mysql2/promise");

async function importCSV() {

    const db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1234",
        database: "weather_data"
    });

    const rows = [];

    fs.createReadStream("cities.csv")
        .pipe(csv())
        .on("data", (row) => {
            rows.push(row);
        })
        .on("end", async () => {

            try {

                for (const row of rows) {

                    await db.execute(
                        `
                        INSERT INTO Cities
                        (
                            id,
                            city,
                            state,
                            longitude,
                            latitude,
                            station
                        )
                        VALUES (?, ?, ?, ?, ?, ?)
                        `,
                        [
                            parseInt(row.id),
                            row.city,
                            row.state,
                            parseFloat(row.longitude),
                            parseFloat(row.latitude),
                            row.station
                        ]
                    );
                }

                console.log(
                    `${rows.length} cities imported successfully.`
                );

            } catch (error) {

                console.error(error);

            } finally {

                await db.end();

            }
        });
}

importCSV();