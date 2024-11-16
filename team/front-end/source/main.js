// main.js
import { GeolocationMapComponent } from './components/geolocation/geolocation.js';


const app = document.getElementById('app');


const geolocationMap = new GeolocationMapComponent('map', 42.376800, -72.519444, 15);


const mapContainer = geolocationMap.render();
app.appendChild(mapContainer);
