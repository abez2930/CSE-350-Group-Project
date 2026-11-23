async function getWeather() {
    const cityValue = document.getElementById("city1").value;
    const output = document.getElementById("weather");

    // Do not request weather if no city is selected
    if (cityValue === "") {
        output.value = "";
        return;
    }

    try {
        const response = await fetch(
            `/api/weather/${encodeURIComponent(cityValue)}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Weather data request failed.");
        }

        const data = await response.json();
        const temperature = data.temperature === null
            ? null
            : Number(data.temperature);
        const humidity = data.humidity === null
            ? null
            : Number(data.humidity);
        const windDirection = data.windDirection === null
            ? null
            : Number(data.windDirection);
        const windSpeed = data.windSpeed === null
            ? null
            : Number(data.windSpeed);
        const pressure = data.pressure === null
            ? null
            : Number(data.pressure);
        const conditions = data.conditions || "Conditions unavailable";

        // Format weather data
        const tempText = temperature === null
            ? "Unavailable"
            : (temperature * 9 / 5 + 32).toFixed(0) + " °F";
        const humidityText = humidity === null
            ? "Unavailable"
            : humidity.toFixed(0) + "%";
        const pressureText = pressure === null
            ? "Unavailable"
            : (pressure / 100).toFixed(0);

        // Format wind data based on direction
        let windText = "";

        if (windSpeed === null) {
            windText = "Unavailable";
        } else if (windSpeed === 0) {
            windText = "Calm";
        } else if (windDirection === null) {
            windText = "Direction unavailable at " +
                (windSpeed / 1.609).toFixed(0) + "mph";
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
            "Station: " + data.city + ", " + data.state +
            "\nTimestamp: " + new Date(data.querytime).toLocaleString() +
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