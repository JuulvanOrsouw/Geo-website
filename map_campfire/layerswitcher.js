import { map } from "./map.js";
import { camp_fire } from "./data/camp_fire.js";
import { house_1_10 } from "./data/house_1_10.js";

// Define base map layers
const osmLayer = new L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  maxZoom: 18
});

const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

const Esri_WorldDarkGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  maxZoom: 18
});

// Define base maps object
const basemaps = {
  'Open Streetmap': osmLayer,
  'ESRI Imagery': Esri_WorldImagery,
  'ESRI Light Gray': Esri_WorldGrayCanvas,
  'ESRI Dark Gray': Esri_WorldDarkGrayCanvas
};

// Add default base map layer to the map
map.addLayer(osmLayer);

// Define style for the camp fire layer
const campFireStyle = {
  color: "#E53935",
  weight: 2,
};
const campFireLayer = L.geoJSON(camp_fire, {
  style: campFireStyle
});

map.addLayer(campFireLayer);


// Define the style for the house_1_10 layer using divIcon
const house_1_10Style = feature => {
  return {
    className: 'house-marker',
    html: `<div class="marker-label">${feature.properties.label || ''}</div>`,
    iconSize: [20, 20],
    iconAnchor: [0, 0],
  };
};

// Initialize marker cluster group
const markers = L.markerClusterGroup();

// Add geoJSON data with custom markers
L.geoJSON(house_1_10, {
  pointToLayer: (feature, latlng) => {
    return L.marker(latlng, { icon: L.divIcon(house_1_10Style(feature)) });
  }
}).eachLayer(layer => {
  // Add popup with detailed feature properties
  const properties = layer.feature.properties;
  const popupContent = `
    <b>Damage:</b> ${properties.DAMAGE || 'No damage info'}<br>
    <b>Structure Type:</b> ${properties.STRUCTURETYPE || 'No structure type'}
  `;
  
  layer.bindPopup(popupContent);
  
  markers.addLayer(layer);
});

map.addLayer(markers);



// Define layer control options
const layers = {
  "Burned Houses": markers,
};

// Create and add the layer switcher control to the map
const lagenSwitcher = new L.Control.Layers(basemaps, layers);
map.addControl(lagenSwitcher)
