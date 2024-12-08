export class GeolocationMapComponent {
  #container = null;
  #restaurants = [];
  #map = null; // Add a reference to the map

  constructor(elementId, latitude = 42.3780039, longitude = -72.520053 + 0.005, zoomLevel = 13) {
    this.elementId = elementId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoomLevel = zoomLevel;
  }

  // Haversine formula to calculate distance between two points in kilometers
  haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  // Convert degrees to radians
  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Load Leaflet's CSS and JS
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

  // Fetch restaurant data from the API
  async fetchRestaurants() {
    try {
      const response = await fetch('http://127.0.0.1:3000/api/getrestaurants', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch restaurants. Status: ${response.status}`);
      }

      const restaurants = await response.json();
      console.log('Fetched restaurants:', restaurants);

      if (!Array.isArray(restaurants) || restaurants.length === 0) {
        console.warn('No restaurants found in the response.');
        return [];
      }

      return restaurants.map((restaurant) => ({
        lat: restaurant.latitude,
        lon: restaurant.longitude,
        name: restaurant.name,
        cuisine: restaurant.cuisine, // Assuming "cuisine" is part of the restaurant data
      }));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  }

  // Initialize the map and add markers
  async initializeMap() {
    const mapElement = document.getElementById(this.elementId);
    if (!mapElement) {
      console.error('Map container not found');
      return;
    }

    // Create the map only if it hasn't been created already
    if (!this.#map) {
      this.#map = L.map(this.#container).setView([this.latitude, this.longitude], this.zoomLevel);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.#map);
    } else {
      // If map already exists, just update the view
      this.#map.setView([this.latitude, this.longitude], this.zoomLevel);
    }

    // Fetch restaurants
    this.#restaurants = await this.fetchRestaurants();

    // Add markers with distances
    this.addMarkers(this.#map, this.latitude, this.longitude);
  }

  // Add markers to the map with distance calculation
  addMarkers(map, selectedLat, selectedLon) {
    const listContainer = document.getElementById(`${this.elementId}-list`);
    if (listContainer) {
      listContainer.innerHTML = ''; // Clear previous entries
    }

    if (this.#restaurants.length === 0) {
      if (listContainer) {
        listContainer.textContent = 'No restaurants available.';
      }
      return;
    }

    // Add markers for each restaurant
    this.#restaurants.forEach((restaurant) => {
      const { lat, lon, name, cuisine } = restaurant;

      // Calculate distance from the selected location
      const distance = this.haversine(selectedLat, selectedLon, lat, lon).toFixed(2);

      // Add markers to the map with name, cuisine, and distance in the popup
      L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${name}</b><br><i>Cuisine: ${cuisine}</i><br><b>Distance: ${distance} km</b>`);

      // Add restaurant names with distance to the list
      if (listContainer) {
        const listItem = document.createElement('div');
        listItem.className = 'restaurant-list-item';
        listItem.textContent = `${name} (${cuisine}) - ${distance} km`;
        listItem.onclick = () => map.setView([lat, lon], this.zoomLevel);
        listContainer.appendChild(listItem);
      }
    });

    console.log('Rendered restaurant names, cuisines, and markers with distances.');
  }

  // Update the map and markers when the user selects a location
  updateLocation(location) {
    let selectedLat, selectedLon;

    switch (location) {
      case 'Amherst':
        selectedLat = 42.3780039;  // Amherst latitude
        selectedLon = -72.520053 + 0.005;  // Amherst longitude adjusted to the right
        break;
      case 'Northampton':
        selectedLat = 42.319829; // Northampton latitude
        selectedLon = -72.6284675; // Northampton longitude
        break;
      case 'South Hadley':
        selectedLat = 42.2587; // South Hadley latitude
        selectedLon = -72.5695; // South Hadley longitude
        break;
      case 'Hadley': // New case for Hadley
        selectedLat = 42.3418;  // Hadley latitude
        selectedLon = -72.5884;  // Hadley longitude
        break;
      default:
        return;
    }

    // Update the map view without reinitializing the map
    this.latitude = selectedLat;
    this.longitude = selectedLon;

    // Update the map center
    this.#map.setView([this.latitude, this.longitude], this.zoomLevel);

    // Add markers with distances from the selected location
    this.addMarkers(this.#map, this.latitude, this.longitude);
  }

  // Render the map container without the dropdown
  render() {
    this.loadCSS();

    // Create wrapper for the map
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.height = '400px';  // Reduced the height of the wrapper

    // Map container
    const mapElement = document.createElement('div');
    mapElement.id = this.elementId;
    mapElement.style.width = '100%'; // Map takes up the full width of the parent container
    mapElement.style.height = '300px'; // Reduced the height of the map container

    // Append the map container to the wrapper
    wrapper.appendChild(mapElement);

    this.#container = mapElement;

    this.initializeMap(); // Initialize the map with the default location

    return wrapper;
  }
}
