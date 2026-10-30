//WEATHER DATA JAVASCRIPT

async function getWeather() {
    const cityValue = document.getElementById("city1").value;
    const output = document.getElementById("weather");

    // Do not request weather if no city is selected
    if (cityValue === "") {
        output.value = "";
        return;
    }

    try {
        // Read cities.csv
        const response = await fetch("cities.csv");
        const csv = await response.text();
        const rows = csv.trim().split(/\r?\n/);

        // Find the selected city's ID
        const selectedId = cityValue;
        let station = "";

        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(",");
            const id = columns[0].trim();

            if (id === selectedId) {
                station = columns[5].trim();
                break;
            }
        }

        // Check that a station was found
        if (station === "") {
            output.value = "Weather station not found.";
            return;
        }

        // Request latest weather observation
        const weatherResponse = await fetch(
            `https://api.weather.gov/stations/${station}/observations/latest`,
            {
                headers: {
                    "Accept": "application/geo+json"
                }
            }
        );

        const data = await weatherResponse.json();
        const properties = data.properties;

        // Get weather data
        const temperature = properties.temperature.value;
        const humidity = properties.relativeHumidity.value;
        const windDirection = properties.windDirection.value;
        const windSpeed = properties.windSpeed.value;
        const pressure = properties.barometricPressure.value;
        const conditions = properties.textDescription;
        const location = properties.stationName;
        const timestamp = properties.timestamp;

        // Format weather data
        const tempText =
            (temperature * 9 / 5 + 32).toFixed(0) + " °F";

        const humidityText = humidity.toFixed(0) + "%";
        const pressureText = (pressure / 100).toFixed(0);

        // Format wind data based on direction
        let windText = "";

        if (windSpeed == 0) {
            windText = "Calm";
        } else if (windDirection < 12.25) {
            windText = windDirection + "°N at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 34.75) {
            windText = windDirection + "°NNE at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 57.25) {
            windText = windDirection + "°NE at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 79.75) {
            windText = windDirection + "°ENE at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 102.25) {
            windText = windDirection + "°E at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 124.75) {
            windText = windDirection + "°ESE at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 147.25) {
            windText = windDirection + "°SE at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 169.75) {
            windText = windDirection + "°SSE at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 192.25) {
            windText = windDirection + "°S at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 214.75) {
            windText = windDirection + "°SSW at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 237.25) {
            windText = windDirection + "°SW at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 259.75) {
            windText = windDirection + "°WSW at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 282.25) {
            windText = windDirection + "°W at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 304.75) {
            windText = windDirection + "°WNW at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 327.25) {
            windText = windDirection + "°NW at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else if (windDirection < 349.25) {
            windText = windDirection + "°NNW at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        } else {
            windText = windDirection + "°N at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
        }

        // Output weather data
        output.value =
            "Station: " + location +
            "\nTimestamp: " + new Date(timestamp).toLocaleString() +
            "\nTemperature: " + tempText +
            "\nHumidity: " + humidityText +
            "\nAir Pressure: " + pressureText +
            "\nWind: " + windText +
            "\nCurrent Conditions: " + conditions;

    } catch (error) {
        console.error("Error retrieving weather:", error);
        output.value = "Unable to retrieve weather data. Please try again.";
    }
}