const US_CENTER = [39.5, -98.35];   // roughly the middle of the lower 48 states
const US_ZOOM = 4;                  // whole-country view
const ONE_CITY_ZOOM = 8;            // zoom when only one city is picked
const TWO_CITY_MAX_ZOOM = 10;       // closest zoom when fitting two nearby cities

const mapElement = document.getElementById("map");
let map = null;
let pinA = null;
let pinB = null;

// Risk: the map depends on Leaflet loading from a CDN. If it didn't load,
// show a message instead of breaking the rest of the page (NFR3).
if (window.L) {
    map = L.map(mapElement, {
        scrollWheelZoom: false   // scrolling the page shouldn't zoom the map; use + / - or double-click
    }).setView(US_CENTER, US_ZOOM);

    // OpenStreetMap's usage policy requires this credit to stay visible on the map
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
} else {
    mapElement.textContent = "The map couldn't load. Check your internet connection and refresh the page.";
}

// Builds a pin: a circle in the panel's color with its letter, plus the city's name.
// Text is set with textContent (not innerHTML) so a city name can never inject code (NFR6).
// labelOnLeft puts the name on the left of the circle, so two cities' labels never point at each other.
function createPinIcon(letter, pinClass, cityName, labelOnLeft) {
    const pin = document.createElement("div");
    pin.className = labelOnLeft ? "map-pin map-pin-label-left" : "map-pin";
    pin.setAttribute("aria-hidden", "true");   // #map-summary describes the pins for screen readers

    const marker = document.createElement("span");
    marker.className = "map-pin-marker";
    marker.textContent = letter;

    const label = document.createElement("span");
    label.className = "map-pin-label";
    label.textContent = cityName;

    pin.append(marker, label);

    return L.divIcon({
        className: pinClass,      // map-pin-a or map-pin-b, which sets the color
        html: pin,
        iconSize: [28, 28],       // the circle is 1.75rem = 28px
        iconAnchor: [14, 14]      // the circle's center sits on the city
    });
}

// Removes a city's old pin (if there was one) and adds a new one (if a city is picked)
function placePin(oldPin, city, letter, pinClass, labelOnLeft) {
    if (oldPin) {
        oldPin.remove();
    }
    if (!city) {
        return null;
    }
    return L.marker([city.lat, city.lon], {
        icon: createPinIcon(letter, pinClass, city.name, labelOnLeft),
        interactive: false,   // pins are labels only; clicking them does nothing
        keyboard: false       // so they don't add empty stops when tabbing through the page
    }).addTo(map);
}

// How much room a pin's name label needs beside it: half the circle, the gap, the label, and a small margin
function labelRoom(pin) {
    return 14 + 5 + pin.getElement().querySelector(".map-pin-label").offsetWidth + 12;
}

// Ethical issue (accessibility): a text version of what the map shows, for screen readers
function describeCities(cityA, cityB) {
    if (cityA && cityB) {
        return `The map shows City A, ${cityA.name}, and City B, ${cityB.name}.`;
    }
    if (cityA) {
        return `The map shows City A, ${cityA.name}.`;
    }
    if (cityB) {
        return `The map shows City B, ${cityB.name}.`;
    }
    return "The map shows the United States. No cities are selected.";
}

function showCities(cityA, cityB) {
    document.getElementById("map-summary").textContent = describeCities(cityA, cityB);

    if (!map) {
        return;
    }

    // With two cities, the one farther west gets its label on the left, so the labels point away from each other
    const bothPicked = cityA && cityB;
    const aIsWest = bothPicked && cityA.lon < cityB.lon;

    pinA = placePin(pinA, cityA, "A", "map-pin-a", aIsWest);
    pinB = placePin(pinB, cityB, "B", "map-pin-b", bothPicked && !aIsWest);

    if (bothPicked) {
        // Zoom to fit both cities, leaving room on each side for that side's name label
        let left = labelRoom(aIsWest ? pinA : pinB);
        let right = labelRoom(aIsWest ? pinB : pinA);

        // On a very narrow map, shrink that room so at least 40px is left for the cities themselves
        const available = map.getSize().x - 40;
        if (left + right > available) {
            const scale = available / (left + right);
            left *= scale;
            right *= scale;
        }

        map.fitBounds([[cityA.lat, cityA.lon], [cityB.lat, cityB.lon]], {
            paddingTopLeft: [left, 40],
            paddingBottomRight: [right, 40],
            maxZoom: TWO_CITY_MAX_ZOOM
        });
    } else if (cityA || cityB) {
        const city = cityA || cityB;
        map.setView([city.lat, city.lon], ONE_CITY_ZOOM);
    } else {
        map.setView(US_CENTER, US_ZOOM);
    }
}