export class GeolocationMapComponent {
  #container = null;
  #restaurants = [];
  #map = null; 

  constructor(elementId, latitude = 42.3780039, longitude = -72.520053 + 0.005, zoomLevel = 13) {
    this.elementId = elementId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoomLevel = zoomLevel;
  }

  // this function calculates the disance between the users location and the restaurants
  haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  
  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
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

  // fetching restaurat data
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
        cuisine: restaurant.cuisine, 
        rating: restaurant.rating
      }));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  }

  // this function intialzies the map 
  async initializeMap() {
    const mapElement = document.getElementById(this.elementId);
    if (!mapElement) {
      console.error('Map container not found');
      return;
    }

    if (!this.#map) {
      this.#map = L.map(mapElement).setView([this.latitude, this.longitude], this.zoomLevel);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.#map);
    } else {
      this.#map.setView([this.latitude, this.longitude], this.zoomLevel);
    }

    this.#restaurants = await this.fetchRestaurants();
    this.addMarkers(this.#map, this.latitude, this.longitude);
  }

  // adds markers to the map with distance calculation
  // Adds markers to the map with cuisine and rating
addMarkers(map, selectedLat, selectedLon) {
  const listContainer = document.getElementById(`${this.elementId}-list`);
  if (listContainer) {
    listContainer.innerHTML = '';
  }

  if (this.#restaurants.length === 0) {
    if (listContainer) {
      listContainer.textContent = 'No restaurants available.';
    }
    return;
  }

  this.#restaurants.forEach((restaurant) => {
    const { lat, lon, name, cuisine, rating } = restaurant;  // Ensure that rating is part of the restaurant object

    // Displaying the marker with the cuisine and rating
    L.marker([lat, lon]).addTo(map)
      .bindPopup(`<b>${name}</b><br><i>Cuisine: ${cuisine}</i><br><b>Rating: ${rating || 'N/A'}</b>`);  // Use 'N/A' if rating is not available

    if (listContainer) {
      const listItem = document.createElement('div');
      listItem.className = 'restaurant-list-item';
      listItem.textContent = `${name} (${cuisine}) - Rating: ${rating}`;  // Display the rating in the list
      listItem.onclick = () => map.setView([lat, lon], this.zoomLevel);
      listContainer.appendChild(listItem);
    }
  });

  console.log('Rendered restaurant names, cuisines, ratings, and markers.');
}


  updateLocation(location) {
    let selectedLat, selectedLon;

    switch (location) {
      case 'Amherst':
        selectedLat = 42.3780039;
        selectedLon = -72.520053 + 0.005;
        break;
      case 'Northampton':
        selectedLat = 42.319829;
        selectedLon = -72.6284675;
        break;
      case 'South Hadley':
        selectedLat = 42.2587;
        selectedLon = -72.5695;
        break;
      case 'Hadley':
        selectedLat = 42.3418;
        selectedLon = -72.5884;
        break;
      default:
        return;
    }

    this.latitude = selectedLat;
    this.longitude = selectedLon;
    this.#map.setView([this.latitude, this.longitude], this.zoomLevel);
    this.addMarkers(this.#map, this.latitude, this.longitude);
  }

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

