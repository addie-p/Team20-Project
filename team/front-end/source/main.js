// main.js
import { GeolocationMapComponent } from './components/geolocation/geolocation.js';

// Get the app container
const app = document.getElementById('app');

// Create an instance of GeolocationMapComponent
const geolocationMap = new GeolocationMapComponent('map', 42.376800, -72.519444, 15);

// Render the GeolocationMapComponent to the DOM
const mapContainer = geolocationMap.render();
app.appendChild(mapContainer);
