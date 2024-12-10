import { NavBarComponent } from "./components/NavBarComponent/navbar.js";
import { RestaurantCard } from "./components/RestaurantCardComponent/restaurant-card.js";
import { GeolocationMapComponent } from "./components/geolocation/geolocation.js";
import { saveRestaurant } from "./services/indexeddb.js";

const app = document.getElementById("app");

if (!app) {
  console.error("App container with id 'app' not found.");
} else {
  const navBar = new NavBarComponent();
  const geolocationMap = new GeolocationMapComponent(
    "map",
    42.3768,
    -72.519444,
    15
  );

  app.appendChild(navBar.render());

  const filterBarContainer = document.createElement("div");
  filterBarContainer.id = "filter-bar-container";

  const filterContainer = document.createElement("div");
  filterContainer.id = "filter-container";
  filterContainer.innerHTML = `
    <form id="filterForm">
      <label for="location">Choose your current location:</label>
      <select id="location" name="location">
        <option value="Amherst">Amherst</option>
        <option value="Northampton">Northampton</option>
        <option value="Hadley">Hadley</option>
        <option value="South Hadley">South Hadley</option>
      </select>

      <label for="cuisine">Cuisine Type:</label>
      <select id="cuisine" name="cuisine">
        <option value="">Any</option>
      </select>

      <label for="vegetarian">Vegetarian:</label>
      <input type="checkbox" id="vegetarian" name="vegetarian">

      <label for="price">Price Range:</label>
      <select id="price" name="price">
      </select>

      <label for="distance">Maximum Distance (in kilometers):</label>
      <input type="number" id="distance" name="distance" placeholder="e.g., 0.7" min="0">

      <button type="button" id="applyFilterBtn">Apply Filter</button>
    </form>
  `;

  filterBarContainer.appendChild(filterContainer);
  app.appendChild(filterBarContainer);

  const contentContainer = document.createElement("div");
  contentContainer.id = "content-container";

  const restaurantContainer = document.createElement("div");
  restaurantContainer.id = "restaurant-container";
  restaurantContainer.classList.add("restaurant-list");
  contentContainer.appendChild(restaurantContainer);

  const mapContainerWrapper = document.createElement("div");
  mapContainerWrapper.id = "map-container";
  mapContainerWrapper.appendChild(geolocationMap.render());
  contentContainer.appendChild(mapContainerWrapper);

  app.appendChild(contentContainer);

  renderRestaurantCards("restaurant-container");

 
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "./components/FilterComponent/filter.css";
  document.head.appendChild(style);

  const savedRestaurants = JSON.parse(localStorage.getItem("savedRestaurants")) || [];
  const dislikedRestaurants = JSON.parse(localStorage.getItem("dislikedRestaurants")) || [];
  let currentIndex = 0; // index of restaurant card
  let filteredRestaurants = []; // this array stores the filtered restaurants
  let remainingRestaurants = []; // the remaining restaurants after the users swipe
  let allRestaurants = [];


  // coordinates for each of the users location
  const locations = {
    Amherst: { lat: 42.373611, lon: -72.519444 },
    "South Hadley": { lat: 42.255, lon: -72.6008 },
    Northampton: { lat: 42.325, lon: -72.637 },
    Hadley: { lat: 42.3795, lon: -72.5535 },
  };

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
  }

  async function renderRestaurantCards(containerId) {
    try {
      allRestaurants = await fetchRestaurantsFromBackend();
      const swipedIds = new Set([
        ...savedRestaurants.map((r) => r.id),
        ...dislikedRestaurants.map((r) => r.id),
      ]);
      remainingRestaurants = allRestaurants.filter((r) => !swipedIds.has(r.id));
      filteredRestaurants = [...remainingRestaurants];

      displayNextCard();
    } catch (error) {
      console.error("Error rendering restaurant cards:", error);
    }
  }

  async function fetchRestaurantsFromBackend() {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/getrestaurants");
      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      const restaurants = await response.json();

      return restaurants;
    } catch (error) {
      console.error("Error fetching restaurants from backend:", error);
      throw error;
    }
  }

  function displayNextCard() {
    const container = document.getElementById("restaurant-container");
    container.innerHTML = "";

    if (currentIndex >= filteredRestaurants.length) {
      container.textContent = "No more restaurants to show.";
      return;
    }

    const cardData = filteredRestaurants[currentIndex];

  
    const card = new RestaurantCard(cardData);

    card.addSwipeListeners(
      async (likedRestaurant) => {
        try {
          await fetch("http://127.0.0.1:3000/api/likedrestaurants", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(likedRestaurant),
          });

          savedRestaurants.push(likedRestaurant);
          remainingRestaurants = remainingRestaurants.filter(
            (r) => r.id !== likedRestaurant.id
          );
          currentIndex++;
          updateLocalStorage();
          displayNextCard();
        } catch (error) {
          console.error("Error saving liked restaurant:", error);
        }
      },
      (dislikedRestaurant) => {
        dislikedRestaurants.push(dislikedRestaurant);
        remainingRestaurants = remainingRestaurants.filter(
          (r) => r.id !== dislikedRestaurant.id
        );
        currentIndex++;
        updateLocalStorage();
        displayNextCard();
      }
    );

    container.appendChild(card.render());
  }

  function updateLocalStorage() {
    localStorage.setItem("savedRestaurants", JSON.stringify(savedRestaurants));
    localStorage.setItem("dislikedRestaurants", JSON.stringify(dislikedRestaurants));
  }

  document.getElementById("applyFilterBtn").addEventListener("click", () => {
    applyFilters();
  });

  async function applyFilters() {
    const location = document.getElementById("location").value;
    const cuisine = document.getElementById("cuisine").value;
    const vegetarian = document.getElementById("vegetarian").checked;
    const price = document.getElementById("price").value;
    const distance = document.getElementById("distance").value;
  
    const userLocation = locations[location];
  
    // updating the map with new location
    geolocationMap.updateLocation(location); // we are gonna zoom on the users location
  
    filteredRestaurants = allRestaurants.filter((restaurant) => {
      let matches = true;
  
      
      const restaurantDistance = haversine(
        userLocation.lat,
        userLocation.lon,
        restaurant.latitude,
        restaurant.longitude
      );
      restaurant.distance = restaurantDistance; 
  
     
      if (location && !restaurant.full_address.includes(location)) {
        matches = false;
      }
  
      
      if (cuisine && restaurant.cuisine !== cuisine) {
        matches = false;
      }
  
      
      if (vegetarian && !restaurant.vegetarian) {
        matches = false;
      }
  
     
      if (price && parseInt(restaurant.price) !== parseInt(price)) {
        matches = false;
      }
  
      
      if (distance && restaurantDistance > parseFloat(distance)) {
        matches = false;
      }
  
      return matches;
    });
  
    currentIndex = 0; 
    displayNextCard();
  }

  // tryna popualte the filter system

  function populateFilters() {
    const cuisineSelect = document.getElementById("cuisine");
    const priceSelect = document.getElementById("price");

    const cuisines = [
      "American",
      "Chinese",
      "Taiwanese",
      "Japanese",
      "Brunch",
      "German",
      "Breakfast",
      "Pizza",
      "Cajun",
      "Moroccan",
      "Middle Eastern",
      "Mediterranean",
      "Greek",
      "Italian",
      "Mexican",
    ];

    const priceRanges = [1, 2, 3, 4];

    // Populating the dropdown with values


    const anyCuisineOption = document.createElement("option");
    anyCuisineOption.value = "";
    anyCuisineOption.textContent = "Any";
    cuisineSelect.appendChild(anyCuisineOption);

    
    cuisines.forEach(cuisine => {
      const option = document.createElement("option");
      option.value = cuisine;
      option.textContent = cuisine;
      cuisineSelect.appendChild(option);
    });

    
    const anyPriceOption = document.createElement("option");
    anyPriceOption.value = "";
    anyPriceOption.textContent = "Any";
    priceSelect.appendChild(anyPriceOption);

    
    priceRanges.forEach(range => {
      const option = document.createElement("option");
      option.value = range;
      option.textContent = "$".repeat(range);
      priceSelect.appendChild(option);
    });    
  }

  populateFilters();
}

