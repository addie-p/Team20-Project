// components/geolocation/geolocation.js

// initializing a Leaflet map instance, and displaying nearby restaurants using OpenStreetMap data
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
  
    //fetching restaurant data using the Overpass API and plotting them on the map
    async fetchRestaurants() {
      const overpassUrl = `
        https://overpass-api.de/api/interpreter?data=[out:json];node
        [amenity=restaurant](around:1000,${this.latitude},${this.longitude});
        out;`; //Overpass API URL
  
      try {
        const response = await fetch(overpassUrl);
        const data = await response.json();
  
         // looping through the fetched restaurant data
        data.elements.forEach(element => {
          const { lat, lon, tags } = element;
          const name = tags.name || "Unnamed Restaurant";
          const marker = L.marker([lat, lon]).addTo(this.map); // adding a marker to the map for each restaurant
          marker.bindPopup(`<b>${name}</b><br>${tags.cuisine || "Cuisine not specified"}`);
        });
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    }
  
    // initializing the Leaflet map
    initMap() {
      // initializng the map and setting up the view
      this.map = L.map(this.elementId).setView([this.latitude, this.longitude], this.zoomLevel);
  
    
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(this.map);
  
    
      this.fetchRestaurants();
    }
  

    //rendering the map component on the page
    render() {
      this.loadCSS();
  
      const wrapper = document.createElement("div");
      wrapper.style.width = "80%"; 
      wrapper.style.justifyContent = "center"; 
  
      const mapElement = document.createElement("div");
      mapElement.id = this.elementId; 
      mapElement.style.height = "300px"; 
      mapElement.style.width = "100%"; 
  
      wrapper.appendChild(mapElement);
      this.#container = mapElement;
  
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
      script.onload = () => this.initMap();
      document.head.appendChild(script);
  
      return wrapper;
  }
}


  