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
      // initializng the map and setting up the view
      this.map = L.map(this.elementId).setView([this.latitude, this.longitude], this.zoomLevel);
  
    
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(this.map);
  
    
      this.fetchRestaurants();
    }
  
    render() {
      this.loadCSS();
  
      // Create a container for the map
      const container = document.createElement("div");
      container.id = this.elementId;
  
     
      container.style.height = "300px";  
      container.style.width = "300px";    
  
      this.#container = container;
  
      
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
      script.onload = () => this.initMap();
      document.head.appendChild(script);
  
      return this.#container;
    }
  }
  