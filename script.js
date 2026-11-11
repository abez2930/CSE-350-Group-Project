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

// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. STORE THE SELECTED UNITS AND CITY DATA
    // ==========================================

    const selectedUnits = {
        temperature:
            document.querySelector('input[name="unit-temperature"]:checked')?.value || "F",

        pressure:
            document.querySelector('input[name="unit-pressure"]:checked')?.value || "inHg",

        wind:
            document.querySelector('input[name="unit-wind"]:checked')?.value || "mph"
    };

    const cityWeather = {
        a: null,
        b: null
    };

    const cityNames = {
        a: null,
        b: null
    };

    const cityLocations = {
        a: null,
        b: null
    };

    function citiesAreTheSame(cityKey, cityName) {
        const otherCityKey = cityKey === "a" ? "b" : "a";
        return cityName.toLowerCase() === cityNames[otherCityKey]?.toLowerCase();
    }

    const unitLabels = {
        temperature: {
            F: "°F",
            C: "°C",
            K: "K"
        },

        pressure: {
            inHg: "inHg",
            hPa: "hPa",
            mbar: "mbar"
        },

        wind: {
            mph: "mph",
            kph: "km/h",
            "m/s": "m/s",
            knots: "knots"
        }
    };


    // ==========================================
    // 2. TEMPERATURE CONVERSION
    // ==========================================

    function convertTemperature(celsius, unit) {

        if (celsius === null || !Number.isFinite(celsius)) {
            return null;
        }

        if (unit === "F") {
            return (celsius * 9 / 5) + 32;
        }

        if (unit === "K") {
            return celsius + 273.15;
        }

        return celsius;
    }


    // ==========================================
    // 3. PRESSURE CONVERSION
    // ==========================================

    function convertPressure(hPa, unit) {

        if (hPa === null || !Number.isFinite(hPa)) {
            return null;
        }

        if (unit === "inHg") {
            return hPa / 33.8638866667;
        }

        // hPa and mbar have the same numerical value.
        return hPa;
    }


    // ==========================================
    // 4. WIND SPEED CONVERSION
    // ==========================================

    function convertWind(metersPerSecond, unit) {

        if (
            metersPerSecond === null ||
            !Number.isFinite(metersPerSecond)
        ) {
            return null;
        }

        const factors = {
            mph: 2.2369362921,
            kph: 3.6,
            "m/s": 1,
            knots: 1.9438444924
        };

        return metersPerSecond * factors[unit];
    }


    // ==========================================
    // 5. FORMAT THE WEATHER NUMBERS
    // ==========================================

    function formatNumber(value, digits = 1) {

        if (value === null || !Number.isFinite(value)) {
            return "Not reported";
        }

        return value.toFixed(digits);
    }


    // ==========================================
    // 6. DISPLAY WEATHER FOR ONE CITY
    // ==========================================

    function renderCity(cityKey) {

        const weather = cityWeather[cityKey];

        const panel = document.querySelector(
            `.city-panel-${cityKey}`
        );

        if (!weather || !panel) return;

        function setField(name, value) {

            const element = panel.querySelector(
                `[data-field="${name}"]`
            );

            if (element) {
                element.textContent = value;
            }
        }

        // Temperature and dew point
        setField(
            "temperature",
            formatNumber(
                convertTemperature(
                    weather.temperatureC,
                    selectedUnits.temperature
                )
            )
        );

        setField(
            "dewpoint",
            formatNumber(
                convertTemperature(
                    weather.dewpointC,
                    selectedUnits.temperature
                )
            )
        );

        // Pressure
        setField(
            "pressure",
            formatNumber(
                convertPressure(
                    weather.pressureHpa,
                    selectedUnits.pressure
                )
            )
        );

        // Wind speed
        setField(
            "wind",
            formatNumber(
                convertWind(
                    weather.windMps,
                    selectedUnits.wind
                )
            )
        );

        // Other weather information
        setField(
            "humidity",
            weather.humidity === null
                ? "Not reported"
                : `${formatNumber(weather.humidity, 0)}%`
        );

        setField(
            "condition",
            weather.conditions || "Conditions not reported"
        );

        setField(
            "observed",
            weather.observed
                ? new Date(weather.observed).toLocaleString()
                : "Not reported"
        );

        setField(
            "retrieved",
            new Date().toLocaleString()
        );

        setField(
            "station",
            weather.station || "Not reported"
        );

        // Update the measurement labels
        panel.querySelectorAll('[data-unit="temperature"]')
            .forEach(element => {
                element.textContent =
                    unitLabels.temperature[selectedUnits.temperature];
            });

        panel.querySelectorAll('[data-unit="pressure"]')
            .forEach(element => {
                element.textContent =
                    unitLabels.pressure[selectedUnits.pressure];
            });

        panel.querySelectorAll('[data-unit="wind"]')
            .forEach(element => {
                element.textContent =
                    unitLabels.wind[selectedUnits.wind];
            });
    }


    // ==========================================
    // 7. UPDATE BOTH CITY PANELS
    // ==========================================

    function renderAllCities() {

        renderCity("a");

        renderCity("b");
    }


    // ==========================================
    // 8. CONVERT STATE ABBREVIATIONS
    // ==========================================

    function stateName(abbreviation) {

        const states = {
            AL:"Alabama", AK:"Alaska", AZ:"Arizona",
            AR:"Arkansas", CA:"California", CO:"Colorado",
            CT:"Connecticut", DE:"Delaware", FL:"Florida",
            GA:"Georgia", HI:"Hawaii", ID:"Idaho",
            IL:"Illinois", IN:"Indiana", IA:"Iowa",
            KS:"Kansas", KY:"Kentucky", LA:"Louisiana",
            ME:"Maine", MD:"Maryland", MA:"Massachusetts",
            MI:"Michigan", MN:"Minnesota", MS:"Mississippi",
            MO:"Missouri", MT:"Montana", NE:"Nebraska",
            NV:"Nevada", NH:"New Hampshire", NJ:"New Jersey",
            NM:"New Mexico", NY:"New York", NC:"North Carolina",
            ND:"North Dakota", OH:"Ohio", OK:"Oklahoma",
            OR:"Oregon", PA:"Pennsylvania", RI:"Rhode Island",
            SC:"South Carolina", SD:"South Dakota",
            TN:"Tennessee", TX:"Texas", UT:"Utah",
            VT:"Vermont", VA:"Virginia", WA:"Washington",
            WV:"West Virginia", WI:"Wisconsin",
            WY:"Wyoming", DC:"District of Columbia"
        };

        return states[abbreviation] || abbreviation;
    }


    // ==========================================
    // 9. UPDATE CITY WEATHER FROM THE API
    // ==========================================

    async function loadCityWeather(cityKey, cityName) {

        const panel = document.querySelector(
            `.city-panel-${cityKey}`
        );

        if (!panel) return;

        cityNames[cityKey] = cityName;
        cityLocations[cityKey] = null;

        panel.dataset.state = "loading";

        panel.querySelectorAll('[data-field="city-name"]')
            .forEach(element => {
                element.textContent = cityName;
            });

        try {

            // Find the city's coordinates
            const searchUrl =
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.split(",")[0])}&count=10&language=en&format=json`;

            const geoResponse = await fetch(searchUrl);

            if (!geoResponse.ok) {
                throw new Error("Could not look up this city.");
            }

            const geoData = await geoResponse.json();

            const wantedState = cityName.split(",")[1]?.trim();

            const match = (geoData.results || []).find(place =>
                place.country_code === "US" &&
                (!wantedState ||
                    place.admin1 === stateName(wantedState))
            ) || (geoData.results || []).find(place =>
                place.country_code === "US"
            );

            if (!match) {
                throw new Error("City coordinates were not found.");
            }

            cityLocations[cityKey] = {
                name: cityName,
                lat: match.latitude,
                lon: match.longitude
            };
            updateMap();


            // Find the National Weather Service location
            const pointResponse = await fetch(
                `https://api.weather.gov/points/${match.latitude},${match.longitude}`,
                {
                    headers: {
                        Accept: "application/geo+json"
                    }
                }
            );

            if (!pointResponse.ok) {
                throw new Error(
                    "The National Weather Service could not locate this city."
                );
            }

            const pointData = await pointResponse.json();

            const stationsUrl =
                pointData.properties?.observationStations;

            if (!stationsUrl) {
                throw new Error("No nearby weather station was found.");
            }


            // Find the closest reporting station
            const stationsResponse = await fetch(stationsUrl, {
                headers: {
                    Accept: "application/geo+json"
                }
            });

            if (!stationsResponse.ok) {
                throw new Error(
                    "Could not retrieve nearby weather stations."
                );
            }

            const stationsData = await stationsResponse.json();

            const station = stationsData.features?.[0];

            if (!station?.id) {
                throw new Error(
                    "No reporting weather station was found."
                );
            }


            // Get the latest weather observation
            const observationResponse = await fetch(
                `${station.id}/observations/latest`,
                {
                    headers: {
                        Accept: "application/geo+json"
                    }
                }
            );

            if (!observationResponse.ok) {
                throw new Error(
                    "The latest weather observation is unavailable."
                );
            }

            const observationData =
                await observationResponse.json();

            const p = observationData.properties || {};


            // Save weather in standard units
            cityWeather[cityKey] = {

                temperatureC:
                    p.temperature?.value ?? null,

                dewpointC:
                    p.dewpoint?.value ?? null,

                humidity:
                    p.relativeHumidity?.value ?? null,

                pressureHpa:
                    p.barometricPressure?.value == null
                        ? null
                        : p.barometricPressure.value / 100,

                windMps:
                    p.windSpeed?.value == null
                        ? null
                        : p.windSpeed.value / 3.6,

                conditions:
                    p.textDescription || "Conditions not reported",

                observed:
                    p.timestamp || null,

                station:
                    p.stationName ||
                    station.properties?.name ||
                    station.id.split("/").pop()
            };


            // Display the new weather information
            renderCity(cityKey);

            panel.dataset.state = "loaded";

        } catch (error) {

            console.error(
                `WeatherNow ${cityKey.toUpperCase()} error:`,
                error
            );

            panel.dataset.state = "error";
            updateMap();

            const errorTitle = panel.querySelector(
                '[data-field="city-name"]'
            );

            if (errorTitle) {
                errorTitle.textContent = cityName;
            }
        }
    }


    // ==========================================
    // 10. UPDATE THE MAP
    // ==========================================

    function updateMap() {
        if (typeof showCities === "function") {
            showCities(cityLocations.a, cityLocations.b);
        }
    }


    // ==========================================
    // 11. CONNECT THE UNIT CONVERSION BUTTONS
    // ==========================================

    document.querySelectorAll('input[name^="unit-"]')
        .forEach(radio => {

            radio.addEventListener("change", () => {

                if (!radio.checked) return;

                if (radio.name === "unit-temperature") {
                    selectedUnits.temperature = radio.value;
                }

                if (radio.name === "unit-pressure") {
                    selectedUnits.pressure = radio.value;
                }

                if (radio.name === "unit-wind") {
                    selectedUnits.wind = radio.value;
                }

                // Update both cities
                renderAllCities();
            });
        });


    // ==========================================
    // 12. MAKE THE CITY DROPDOWNS WORK
    // ==========================================

    function setupCityDropdown(cityKey) {

        const dropdown = document.getElementById(
            `city-${cityKey}-dropdown`
        );

        const selectedInput = document.getElementById(
            `city-${cityKey}-selected`
        );

        const filterInput = document.getElementById(
            `city-${cityKey}-filter`
        );

        const list = document.getElementById(
            `city-${cityKey}-list`
        );

        if (!dropdown || !selectedInput ||
            !filterInput || !list) {
            return;
        }

        const options = Array.from(
            list.querySelectorAll("li[data-value]")
        );


        // Close the dropdown
        function closeDropdown() {

            dropdown.classList.remove("is-open");
        }


        // Open and close the dropdown
        selectedInput.addEventListener("click", () => {

            const willOpen =
                !dropdown.classList.contains("is-open");

            document.querySelectorAll(
                ".city-search-dropdown.is-open"
            ).forEach(element => {
                element.classList.remove("is-open");
            });

            if (willOpen) {

                dropdown.classList.add("is-open");

                filterInput.value = "";

                options.forEach(option => {
                    option.hidden = false;
                });

                filterInput.focus();
            }
        });


        // Search and filter cities
        filterInput.addEventListener("input", () => {

            const search =
                filterInput.value.trim().toLowerCase();

            options.forEach(option => {

                option.hidden =
                    !option.textContent.trim()
                        .toLowerCase()
                        .includes(search);
            });
        });


        // Select a city
        options.forEach(option => {

            option.addEventListener("click", () => {

                const cityName = option.textContent.trim();

                if (!cityName) return;

                //To prevent both buttons from having the same cities
                if (citiesAreTheSame(cityKey, cityName)) {
                    alert("You cannot select the same city for both buttons. Please choose a different city.");
                    return;
                }

                selectedInput.value = cityName;

                options.forEach(item => {

                    item.classList.toggle(
                        "is-selected",
                        item === option
                    );
                });

                closeDropdown();

                // Load weather for the selected city
                loadCityWeather(cityKey, cityName);
            });
        });


        // Allow keyboard selection
        filterInput.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                event.preventDefault();

                const firstVisible =
                    options.find(option => !option.hidden);

                if (firstVisible) {
                    firstVisible.click();
                }

            } else if (event.key === "Escape") {

                closeDropdown();

                selectedInput.focus();
            }
        });


        // Close dropdown when clicking outside
        document.addEventListener("click", event => {

            if (!dropdown.contains(event.target)) {
                closeDropdown();
            }
        });
    }


    // ==========================================
    // 13. ACTIVATE BOTH CITY DROPDOWNS
    // ==========================================

    setupCityDropdown("a");

    setupCityDropdown("b");


    // ==========================================
    // 14. CONNECT THE RETRY BUTTONS
    // ==========================================

    document.querySelectorAll(
        ".panel-state-error .button"
    ).forEach((button, index) => {

        button.addEventListener("click", () => {

            const cityKey = index === 0 ? "a" : "b";

            loadCityWeather(
                cityKey,
                cityNames[cityKey]
            );
        });
    });


    // ==========================================
    // 15. LOAD THE DEFAULT CITIES
    // ==========================================

    updateMap();

});