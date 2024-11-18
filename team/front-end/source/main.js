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

    const filterBarContainer = document.createElement('div');
    filterBarContainer.id = 'filter-bar-container';

    const filterToggleButton = document.createElement('button');
    filterToggleButton.id = 'filter-toggle-button';
    filterToggleButton.innerHTML = `Filter <span>&#9660;</span>`;
    filterToggleButton.classList.add('filter-toggle');
    filterToggleButton.onclick = () => {
        filterContainer.classList.toggle('hidden');
        const arrow = filterToggleButton.querySelector('span');
        arrow.innerHTML = filterContainer.classList.contains('hidden') ? '&#9654;' : '&#9660;';
    };
    filterBarContainer.appendChild(filterToggleButton);

    const filterContainer = document.createElement('div');
    filterContainer.id = 'filter-container';
    filterContainer.innerHTML = `
    <form id="filterForm">
        <label for="cuisine">Cuisine Type:</label>
        <select id="cuisine" name="cuisine">
            <option value="">Any</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Japanese">Japanese</option>
            <option value="Mexican">Mexican</option>
            <option value="Pizza">Pizza</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Fast Food">Fast Food</option>
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
        <input type="number" id="distance" name="distance" placeholder="e.g., 5" min="1">

        <button type="button" id="applyFilters">Apply Filters</button>
    </form>
`;

    filterBarContainer.appendChild(filterContainer);
    app.appendChild(filterBarContainer);

    const contentContainer = document.createElement('div');
    contentContainer.id = 'content-container';

    const restaurantContainer = document.createElement('div');
    restaurantContainer.id = 'restaurant-container';
    restaurantContainer.classList.add('restaurant-list');
    contentContainer.appendChild(restaurantContainer);

    const mapContainerWrapper = document.createElement('div');
    mapContainerWrapper.id = 'map-container';
    contentContainer.appendChild(mapContainerWrapper);

    app.appendChild(contentContainer);


    renderRestaurantCards('restaurant-container');
}

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = './components/FilterComponent/filter.css';
document.head.appendChild(style);

// geolocation component
const geolocationMap = new GeolocationMapComponent('map', 42.376800, -72.519444, 15);
const mapContainer = geolocationMap.render();
app.appendChild(mapContainer);

const savedRestaurants = JSON.parse(localStorage.getItem('savedRestaurants')) || [];
const dislikedRestaurants = JSON.parse(localStorage.getItem('dislikedRestaurants')) || [];
let currentIndex = 0; // tracking index of restaurant card
let filteredRestaurants = []; // restaurants after applying filter
let remainingRestaurants = []; // restaurants after swipes
let allRestaurants = []; // all restaurants

// get restaurants from CSV and render
async function renderRestaurantCards(containerId) {
    try {
        allRestaurants = await fetchCSV(); 

        // don't include already liked and dislike restaurants in stack
        const swipedIds = new Set([
            ...savedRestaurants.map((r) => r.id),
            ...dislikedRestaurants.map((r) => r.id),
        ]);
        remainingRestaurants = allRestaurants.filter((r) => !swipedIds.has(r.id));
        filteredRestaurants = [...remainingRestaurants];

        displayNextCard();
    } catch (error) {
        console.error('Error rendering restaurant cards:', error);
    }
}

// apply filters to remainingRestaurants
document.getElementById('applyFilters').addEventListener('click', () => {
    const cuisine = document.getElementById('cuisine').value.toLowerCase();
    const vegetarian = document.getElementById('vegetarian').checked;
    const price = document.getElementById('price').value;
    const distance = Number(document.getElementById('distance').value);

    filteredRestaurants = [...remainingRestaurants].filter((r) => {
        if (cuisine && !r.Cuisine?.toLowerCase().includes(cuisine)) return false;
        if (vegetarian && r.Vegetarian?.toLowerCase() !== 'yes') return false;
        if (price && r.Price !== price) return false;
        if (distance && Number(r.Distance) > distance) return false;
        return true;
    });

    currentIndex = 0; // reset index to start from the beginning of the new stack
    displayNextCard();
});

// display the next restaurant card
function displayNextCard() {
    const container = document.getElementById('restaurant-container');
    container.innerHTML = '';

    if (currentIndex >= filteredRestaurants.length) {
        container.textContent = 'No more restaurants to show.';
        return;
    }

    const cardData = filteredRestaurants[currentIndex];
    const card = new RestaurantCard(cardData);

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
                    imageUrl: likedRestaurant.Image || '',
                    rating: likedRestaurant.Rating || 'N/A',
                    visited: false,
                });
                console.log('Restaurant saved:', likedRestaurant);
            } catch (error) {
                console.error('Error saving restaurant:', error);
            }

            savedRestaurants.push(likedRestaurant);
            remainingRestaurants = remainingRestaurants.filter(
                (r) => r.id !== likedRestaurant.id
            ); 
            currentIndex++;
            updateLocalStorage();
            displayNextCard();
        },
        (dislikedRestaurant) => {
            console.log('Disliked restaurant:', dislikedRestaurant);
            dislikedRestaurants.push(dislikedRestaurant);
            remainingRestaurants = remainingRestaurants.filter(
                (r) => r.id !== dislikedRestaurant.id
            );
            currentIndex++;
            updateLocalStorage();
            displayNextCard();
        }
    );
}

// update local storage with savedRestaurants and dislikedRestaurants
function updateLocalStorage() {
    localStorage.setItem('savedRestaurants', JSON.stringify(savedRestaurants));
    localStorage.setItem('dislikedRestaurants', JSON.stringify(dislikedRestaurants));
}

// fetch data from csv
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

// parse data from csv
function parseCSV(data) {
    const rows = data.split('\n').map((row) => row.trim());
    const headers = rows[0].split(',');

    return rows.slice(1).map((row, index) => {
        const values = row.split(',');
        return headers.reduce((obj, header, idx) => {
            obj[header.trim()] = values[idx]?.trim();
            return obj;
        }, { id: index + 1 });
    });
}
