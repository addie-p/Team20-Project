export class GeolocationMapComponent {
 #container = null;
 #restaurants = [];
 #map = null;
 currentMarker = null;
 constructor(elementId, latitude = 42.3780039, longitude = -72.520053 + 0.005, zoomLevel = 8) {
   this.elementId = elementId;
   this.latitude = latitude;
   this.longitude = longitude;
   this.zoomLevel = zoomLevel;
 }
 // loading leaflet for the mini map
 loadCSS() {
   const styleSheet = document.createElement('link');
   styleSheet.rel = 'stylesheet';
   styleSheet.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';  // Leaflet CSS
   document.head.appendChild(styleSheet);
   const script = document.createElement('script');
   script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';  // Leaflet JS
   script.onload = () => this.initializeMap();  // Initialize the map after the script loads
   document.head.appendChild(script);
 }
 // this function intialzies the map
 initializeMap(selectedLat, selectedLon, selectedName) {
   const mapElement = document.getElementById(this.elementId);
   if (!selectedLat) {
     selectedLat = 42.3780039;
   }
   if (!selectedLon) {
     selectedLon = 42.3780039;
   }
   if (!selectedName) {
     selectedName = "Restaurant";
   }
   if (!mapElement) {
     console.error('Map container not found');
     return;
   }
   console.log(selectedName);
   if (!this.#map) {
     this.#map = L.map(mapElement).setView([this.latitude, this.longitude], this.zoomLevel);
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
     }).addTo(this.#map);
   } else {
     this.#map.setView([selectedLat, selectedLon], this.zoomLevel);
   }
   this.addMarkers(this.#map, selectedLat, selectedLon, selectedName);
 }
 // adds markers to the map with distance calculation
 // Adds markers to the map with cuisine and rating
addMarkers(map, selectedLat, selectedLon, selectedName) {
 // Displaying the marker with the cuisine and rating
 if (this.currentMarker) {
   this.#map.removeLayer(this.currentMarker);  // Clear previous marker
 }
 this.currentMarker = L.marker([selectedLat, selectedLon]).addTo(map)
   .bindPopup(`<b>${selectedName}</b>`);  // Use 'N/A' if rating is not available
}
 // updateLocation(location) {
 //   let selectedLat, selectedLon;
 //   switch (location) {
 //     case 'Amherst':
 //       selectedLat = 42.3780039;
 //       selectedLon = -72.520053 + 0.005;
 //       break;
 //     case 'Northampton':
 //       selectedLat = 42.319829;
 //       selectedLon = -72.6284675;
 //       break;
 //     case 'South Hadley':
 //       selectedLat = 42.2587;
 //       selectedLon = -72.5695;
 //       break;
 //     case 'Hadley':
 //       selectedLat = 42.3418;
 //       selectedLon = -72.5884;
 //       break;
 //     default:
 //       return;
 //   }
 //   this.latitude = selectedLat;
 //   this.longitude = selectedLon;
 //   this.#map.setView([this.latitude, this.longitude], this.zoomLevel);
 //   this.addMarkers(this.#map, this.latitude, this.longitude);
 // }
 render() {
   this.loadCSS();
   const wrapper = document.createElement('div');
   wrapper.style.display = 'flex';
   wrapper.style.flexDirection = 'column';
   wrapper.style.height = '400px';
   const mapElement = document.createElement('div');
   mapElement.id = this.elementId;
   mapElement.style.width = '100%';
   mapElement.style.height = '300px';
   wrapper.appendChild(mapElement);
   this.#container = mapElement;
   setTimeout(() => this.initializeMap(), 0);
   return wrapper;
 }
}
