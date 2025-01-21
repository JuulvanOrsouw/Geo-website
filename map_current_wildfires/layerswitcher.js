import { map } from "./map.js";
import { State } from "./data/state.js";

// Define map layers
let current_wilfdire = new L.TileLayer.WMS('http://localhost:8080/geoserver/Wildfire/wms', {
  layers: 'current_wilfdire',
  format: 'image/png',
  transparent: true,
  cql_filter: '' // Initialize with an empty CQL filter
});

let wildfire_risk = new L.TileLayer.WMS('http://localhost:8080/geoserver/Wildfire/wms', {
  layers: 'NRI_Risk_rating',
  format: 'image/png',
  transparent: true,
});

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
map.addLayer(Esri_WorldDarkGrayCanvas);
map.addLayer(current_wilfdire);

const StateStyle = {
  color: "#FF4500",
  weight: 2,
  opacity: 0.9
};

let StateLayer;

document.addEventListener('DOMContentLoaded', function() {
  const stateSelect = document.getElementById('state-select');

  stateSelect.addEventListener('change', function() {
    const selectedValue = stateSelect.value;
    const stateAbbr = selectedValue.slice(-2); // Extract the last two characters
    console.log('Selected State:', stateAbbr);

    // Update the map layer to show only the selected state
    updateMapLayer(stateAbbr);
  });

  updateMapLayer('');
});

function updateMapLayer(stateAbbr) {
  if (StateLayer) {
    map.removeLayer(StateLayer);
  }

  if (stateAbbr) {
    const filteredState = {
      type: 'FeatureCollection',
      features: State.features.filter(feature => feature.properties.STATE_ABBR === stateAbbr)
    };

    StateLayer = L.geoJSON(filteredState, {
      style: StateStyle
    });

    map.addLayer(StateLayer);
  } else {
    StateLayer = null; 
  }
}



// Define layer control options
const layers = {
  "Current Wildfires": current_wilfdire,
  "Wildfire risk": wildfire_risk,
};

// Create and add base map switcher control to the map
const lagenSwitcher = new L.Control.Layers(basemaps, layers);
map.addControl(lagenSwitcher);

document.addEventListener('DOMContentLoaded', function() {
  const stateSelect = document.getElementById('state-select');

  stateSelect.addEventListener('change', function() {
    const selectedValue = stateSelect.value;
    console.log('Selected State:', selectedValue);

    // Update the CQL filter for the current_wilfdire layer
    if (selectedValue) {
      current_wilfdire.setParams({
        cql_filter: `poostate='${selectedValue}'`
      });
    } else {
      current_wilfdire.setParams({
        cql_filter: ''
      });
    }
  });
});
