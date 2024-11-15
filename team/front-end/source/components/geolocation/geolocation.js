// components/geolocation/geolocation.js
export class GeolocationMapComponent {
    #container = null;
  
    constructor(elementId, latitude, longitude, zoomLevel) {
      this.elementId = elementId;
      this.latitude = latitude;
      this.longitude = longitude;
      this.zoomLevel = zoomLevel;
    }
  
    loadCSS() {
      // Dynamically load Leaflet's CSS
      const styleSheet = document.createElement("link");
      styleSheet.rel = "stylesheet";
      styleSheet.href = "https://unpkg.com/leaflet/dist/leaflet.css";
      document.head.appendChild(styleSheet);
    }
  
    async fetchRestaurants() {
      const overpassUrl = `
        https://overpass-api.de/api/interpreter?data=[out:json];node
        [amenity=restaurant](around:1000,${this.latitude},${this.longitude});
        out;`;
  
      try {
        const response = await fetch(overpassUrl);
        const data = await response.json();
  
        data.elements.forEach(element => {
          const { lat, lon, tags } = element;
          const name = tags.name || "Unnamed Restaurant";
          const marker = L.marker([lat, lon]).addTo(this.map);
          marker.bindPopup(`<b>${name}</b><br>${tags.cuisine || "Cuisine not specified"}`);
        });
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    }
  
    initMap() {
      // Initialize the map and set its view
      this.map = L.map(this.elementId).setView([this.latitude, this.longitude], this.zoomLevel);
  
      // Add the OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(this.map);
  
      // Fetch and display restaurants
      this.fetchRestaurants();
    }
  
    render() {
      this.loadCSS(); // Load Leaflet's CSS
  
      // Create a container for the map
      const container = document.createElement("div");
      container.id = this.elementId;
  
      // Apply inline styles for size (use the CSS provided here)
      container.style.height = "300px";  // Ensure height is applied correctly
      container.style.width = "300px";    // Ensure width is 100%
  
      this.#container = container;
  
      // Load Leaflet JS dynamically and initialize the map
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
      script.onload = () => this.initMap();
      document.head.appendChild(script);
  
      return this.#container;
    }
  }
  