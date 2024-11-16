import { NavBarComponent } from './components/NavBarComponent/navbar.js';
import { RestaurantCard } from './components/RestaurantCardComponent/restaurant-card.js';

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

// create an array of saved restaurants
const savedRestaurants = [];

async function renderRestaurantCards(containerId) {
    try {
        const restaurantData = await fetchCSV();
        const container = document.getElementById(containerId);
        const savedRestaurants = [];
        let currentIndex = 0;

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
                (likedRestaurant) => {
                    savedRestaurants.push(likedRestaurant);
                    console.log('Saved restaurants:', savedRestaurants);
                    currentIndex++;
                    displayNextCard();
                },
                () => {
                    currentIndex++;
                    displayNextCard();
                }
            );
        }

        displayNextCard();
    } catch (error) {
        console.error('Error rendering restaurant cards:', error);
    }
}

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

    return rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
        }, {});
    });
}
