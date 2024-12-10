import { NavBarComponent } from "./components/NavBarComponent/navbar.js";
import { RestaurantCard } from "./components/RestaurantCardComponent/restaurant-card.js";
import { GeolocationMapComponent } from "./components/geolocation/geolocation.js";


// initialize main app
const app = document.getElementById("app");


if (!app) {
 console.error("App container with id 'app' not found.");
} else {
 // Navigation bar from component
 const navBar = new NavBarComponent();


 // Map from component
 const geolocationMap = new GeolocationMapComponent(
   "map",
   42.3768,
   -72.519444,
   15
 );


 // Render navigation bar
 app.appendChild(navBar.render());


 // Render filter bar
 const filterBarContainer = document.createElement("div");
 filterBarContainer.id = "filter-bar-container";


 // Filter dropdown toggle button
 const filterToggleButton = document.createElement("button");
 filterToggleButton.id = "filter-toggle-button";
 filterToggleButton.innerHTML = `Filter <span>&#9660;</span>`;
 filterToggleButton.classList.add("filter-toggle");


 filterToggleButton.onclick = () => {
   filterContainer.classList.toggle("hidden");
   const arrow = filterToggleButton.querySelector("span");
   arrow.innerHTML = filterContainer.classList.contains("hidden")
     ? "&#9654;"
     : "&#9660;";
 };


 // render filter bar toggle button
 filterBarContainer.appendChild(filterToggleButton);


 // render filter container and filter bar choices
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
           <option value="Vietnamese">Vietnamese</option>
           <option value="Japanese">Japanese</option>
           <option value="Mexican">Mexican</option>
           <option value="Pizza">Pizza</option>
           <option value="Breakfast">Breakfast</option>
           <option value="Chinese">Chinese</option>
           <option value="Italian">Italian</option>
           <option value="Indian">Indian</option>
       </select>


       <label for="vegetarian">Vegetarian:
           <input type="checkbox" id="vegetarian" name="vegetarian">
       </label>


       <label for="price">Price Range:</label>
       <select id="price" name="price">
           <option value="">Any</option>
           <option value="$">$</option>
           <option value="$$">$$</option>
           <option value="$$$">$$$</option>
       </select>


       <label for="distance">Maximum Distance (in miles):</label>
       <input type="number" id="distance" name="distance" placeholder="e.g., 5" min="0">


       <button type="button" id="applyFilters">Apply Filters</button>
   </form>
`;


 // append filter container
 filterBarContainer.appendChild(filterContainer);
 app.appendChild(filterBarContainer);


 // render container to store restaurant cards and map
 const contentContainer = document.createElement("div");
 contentContainer.id = "content-container";


 // render container to store restaurant cards
 const restaurantContainer = document.createElement("div");
 restaurantContainer.id = "restaurant-container";
 restaurantContainer.classList.add("restaurant-list");
 contentContainer.appendChild(restaurantContainer);


 // geolocation component
 const mapContainerWrapper = document.createElement("div");
 mapContainerWrapper.id = "map-container";
 mapContainerWrapper.appendChild(geolocationMap.render());
 contentContainer.appendChild(mapContainerWrapper);


 app.appendChild(contentContainer);


 renderRestaurantCards("restaurant-container");
}


// link stylesheet for filter bar
const style = document.createElement("link");
style.rel = "stylesheet";
style.href = "./components/FilterComponent/filter.css";
document.head.appendChild(style);


let currentIndex = 0; // tracking index of restaurant card
let filteredRestaurants = []; // restaurants after applying filter


const savedRestaurants =
 JSON.parse(localStorage.getItem("savedRestaurants")) || [];
const dislikedRestaurants =
 JSON.parse(localStorage.getItem("dislikedRestaurants")) || [];
let remainingRestaurants = []; // restaurants after swipes
let allRestaurants = []; // all restaurants


// coordinates for each of the users location
const locations = {
 Amherst: { lat: 42.373611, lon: -72.519444 },
 "South Hadley": { lat: 42.255, lon: -72.6008 },
 Northampton: { lat: 42.325, lon: -72.637 },
 Hadley: { lat: 42.3795, lon: -72.5535 },
};


// get restaurants from CSV and render
async function renderRestaurantCards(containerId) {
 try {
   // Fetch restaurants from the database
   allRestaurants = await fetchRestaurantsFromBackend();


   // Filter out already liked and disliked restaurants
   const swipedIds = new Set([
     ...savedRestaurants.map((r) => r.id),
     ...dislikedRestaurants.map((r) => r.id),
   ]);
   remainingRestaurants = allRestaurants.filter((r) => !swipedIds.has(r.id));
   filteredRestaurants = [...remainingRestaurants];


   // Dynamically update to the next card after user likes/dislikes
   displayNextCard();
 } catch (error) {
   console.error("Error rendering restaurant cards:", error);
 }
}


async function fetchRestaurantsFromBackend(filters) {
 try {
   const response = await fetch("http://127.0.0.1:3000/api/restaurants/filter", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(filters),
   });


   if (!response.ok) {
     throw new Error("Failed to fetch restaurants.");
   }


   return await response.json();
 } catch (error) {
   console.error("Error fetching restaurants from backend:", error);
   throw error;
 }
}


// apply filters to remainingRestaurants
document.getElementById("applyFilters").addEventListener("click", async () => {
  const location = document.getElementById("location").value;
  const cuisine = document.getElementById("cuisine").value;
  const vegetarian = document.getElementById("vegetarian").checked;
  let price = document.getElementById("price").value;
  if (price === "$") {
    price = 1;
} else if (price === "$$") {
    price = 2;
} else if (price === "$$$") {
  price = 3;
}
 let distance = document.getElementById("distance").value;
 const userLocation = locations[location];
 distance = distance ? parseFloat(distance) : 2;


 // function to return restaurants that apply based on filters
 try {
   filteredRestaurants = await fetchRestaurantsFromBackend({
     cuisine: cuisine || undefined,
     vegetarian: vegetarian || undefined,
     price: price || undefined,
     distance: distance || undefined,
     lat: userLocation.lat,
     lon: userLocation.lon,
   });
   currentIndex = 0;
   displayNextCard();
 } catch (error) {
   console.error("Error applying filters:", error);
 }


 displayNextCard();
});


// display the next restaurant card
function displayNextCard() {
 const container = document.getElementById("restaurant-container");
 container.innerHTML = "";


 if (currentIndex >= filteredRestaurants.length) {
   container.textContent = "No more restaurants to show.";
   return;
 }


 const cardData = filteredRestaurants[currentIndex];
 const card = new RestaurantCard(cardData);


 // swipe listeners for likes/dislikes
 card.addSwipeListeners(
   // event for like
   async (likedRestaurant) => {
     console.log("Liked restaurant:", likedRestaurant);


     try {
       // POST request to save liked restaurant to the backend
       console.log("Sending:", likedRestaurant); // log for testing purposes


       await fetch("http://127.0.0.1:3000/api/likedrestaurants", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(likedRestaurant),
       });


       await fetch(`http://127.0.0.1:3000/api/restaurants/${likedRestaurant.id}`, {
         method: "PUT",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ liked: 1 }),
       });


       // push liked restaurants to db table
       savedRestaurants.push(likedRestaurant);
       // get rid of liked restaurant in stack
       remainingRestaurants = remainingRestaurants.filter(
         (r) => r.id !== likedRestaurant.id
       );
       currentIndex++;
       // update local storage to save changes
       updateLocalStorage();
       displayNextCard();
     } catch (error) {
       console.error("Error saving liked restaurant:", error);
     }
   },
   // event for dislike
   async (dislikedRestaurant) => {
     console.log("Disliked restaurant:", dislikedRestaurant); // log for testing purposes


     await fetch(`http://127.0.0.1:3000/api/restaurants/${dislikedRestaurant.id}`, {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ liked: 1 }),
     });


     // push to dummy table
     dislikedRestaurants.push(dislikedRestaurant);
     // get rid of disliked restaurant in stack
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


// update local storage with savedRestaurants and dislikedRestaurants
function updateLocalStorage() {
 localStorage.setItem("savedRestaurants", JSON.stringify(savedRestaurants));
 localStorage.setItem(
   "dislikedRestaurants",
   JSON.stringify(dislikedRestaurants)
 );
}

