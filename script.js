/* eslint-disable no-undef */
/**
 * Back to home button
 */

// Configuration for the map
let config = {
  minZoom: 4,
  maxZoom: 18,
};

// Initial coordinates and zoom level for the map
const zoom = 4; // Set zoom level to 4
const lat = 37.0902; // Latitude for the center of the USA
const lng = -95.7129; // Longitude for the center of the USA

// Initialize the map centered on the USA
const map = L.map("map", config).setView([lat, lng], zoom);

// Use a black/dark gray basemap (CartoDB Dark Matter)
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © CartoDB',
  maxZoom: 18
}).addTo(map);

// SVG icon for the home button
const htmlTemplate =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 18.451L16 6.031 0 18.451v-5.064L16 .967l16 12.42zM28 18v12h-8v-8h-8v8H4V18l12-9z" /></svg>';

// Create custom button
const customControl = L.Control.extend({
  options: {
    position: "topleft", // Position of the button on the map
  },

  onAdd: function (map) {
    // Create button element
    const btn = L.DomUtil.create("button");
    btn.title = "Back to Home";
    btn.innerHTML = htmlTemplate;
    btn.className += "leaflet-bar back-to-home hidden";

    return btn;
  },
});

// Adding new button to map control
map.addControl(new customControl());

// On map drag end
map.on("moveend", getCenterOfMap);

const buttonBackToHome = document.querySelector(".back-to-home");

function getCenterOfMap() {
  buttonBackToHome.classList.remove("hidden");

  buttonBackToHome.addEventListener("click", () => {
    map.flyTo([lat, lng], zoom); // Fly to the initial coordinates with zoom level 4
  });

  map.on("moveend", () => {
    const { lat: latCenter, lng: lngCenter } = map.getCenter();

    const latC = latCenter.toFixed(3) * 1;
    const lngC = lngCenter.toFixed(3) * 1;

    const defaultCoordinate = [+lat.toFixed(3), +lng.toFixed(3)];

    const centerCoordinate = [latC, lngC];

    if (compareToArrays(centerCoordinate, defaultCoordinate)) {
      buttonBackToHome.classList.add("hidden");
    }
  });
}

const compareToArrays = (a, b) => JSON.stringify(a) === JSON.stringify(b);
