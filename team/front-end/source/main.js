import { NavBarComponent } from './components/NavBarComponent/navbar.js';
import { RestaurantCard } from './components/RestaurantCardComponent/restaurant-card.js';
import { GeolocationMapComponent } from './components/geolocation/geolocation.js';
import { saveRestaurant } from './services/indexeddb.js';


const app = document.getElementById('app');
if (!app) {
    console.error("App container with id 'app' not found.");
} else {
    const navBar = new NavBarComponent();
    app.appendChild(navBar.render());

    const restaurantContainer = document.createElement('div');
    restaurantContainer.id = 'restaurant-container';
    app.appendChild(restaurantContainer);

    renderRestaurantCards('restaurant-container');
}

const geolocationMap = new GeolocationMapComponent('map', 42.376800, -72.519444, 15);


const mapContainer = geolocationMap.render();
app.appendChild(mapContainer);


// create an array of saved restaurants
const savedRestaurants = JSON.parse(localStorage.getItem('savedRestaurants')) || [];
// create an array of disliked restaurants - not rly used just for reference
const dislikedRestaurants = JSON.parse(localStorage.getItem('dislikedRestaurants')) || [];
let currentIndex = JSON.parse(localStorage.getItem('currentIndex')) || 0;

async function renderRestaurantCards(containerId) {
    try {
        let restaurantData = await fetchCSV();
        const container = document.getElementById(containerId);

        if (dislikedRestaurants.length > 0) {
            restaurantData = restaurantData.concat(dislikedRestaurants);
        }

        if (!container) {
            console.error(`Container with id "${containerId}" not found.`);
            return;
        }

        function displayNextCard() {
            if (currentIndex >= restaurantData.length) {
                container.textContent = 'No more restaurants to show.';
                return;
            }

            const cardData = restaurantData[currentIndex];
            const card = new RestaurantCard(cardData);

            container.innerHTML = '';
            container.appendChild(card.render());

            card.addSwipeListeners(
                async (likedRestaurant) => {
                    console.log('Liked restaurant:', likedRestaurant);
            
                    try {
                        await saveRestaurant({
                            id: likedRestaurant.id,
                            name: likedRestaurant.Restaurant,
                            cuisine: likedRestaurant.Cuisine,
                            price: likedRestaurant.Price,
                            vegetarian: likedRestaurant.Vegetarian,
                            town: likedRestaurant.Town,
                            state: likedRestaurant.State,
                            distance: likedRestaurant.Distance,
                            imageUrl: likedRestaurant.Image || '', // Include image URL if available
                            rating: likedRestaurant.Rating || 'N/A',
                            visited: false,
                        });
                        console.log('Restaurant saved:', likedRestaurant);
                    } catch (error) {
                        console.error('Error saving restaurant:', error);
                    }
            
                    savedRestaurants.push(likedRestaurant);
                    currentIndex++;
                    updateLocalStorage();
                    displayNextCard();
                },
                (dislikedRestaurant) => {
                    console.log('Disliked restaurant:', dislikedRestaurant);
                    dislikedRestaurants.push(dislikedRestaurant);
                    currentIndex++;
                    updateLocalStorage();
                    displayNextCard();
                }
            );
            
        }

        displayNextCard();
    } catch (error) {
        console.error('Error rendering restaurant cards:', error);
    }
}

// Helper function to update localStorage
function updateLocalStorage() {
    localStorage.setItem('savedRestaurants', JSON.stringify(savedRestaurants));
    localStorage.setItem('dislikedRestaurants', JSON.stringify(dislikedRestaurants));
    localStorage.setItem('currentIndex', JSON.stringify(currentIndex));
}

// Restore state on load
window.addEventListener('load', () => {
    console.log('Restoring state...');
    console.log('Saved Restaurants:', savedRestaurants);
    console.log('Disliked Restaurants:', dislikedRestaurants);
    console.log('Current Index:', currentIndex);
});


// async function fetch restaurant data from restaurants.csv
async function fetchCSV() {
    try {
        const response = await fetch('./components/restaurants.csv');
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const data = await response.text();
        return parseCSV(data);
    } catch (error) {
        console.error('Error fetching CSV:', error);
        return [];
    }
}

// parse the csv by removing commas and trimming as needed
function parseCSV(data) {
    const rows = data.split('\n').map(row => row.trim());
    const headers = rows[0].split(',');

    return rows.slice(1).map((row, index) => {
        const values = row.split(',');
        return headers.reduce((obj, header, idx) => {
            obj[header.trim()] = values[idx]?.trim();
            return obj;
        }, { id: index + 1 }); // Add a unique id if not present
    });
}
