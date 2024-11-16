import { FilterComponent } from './components/FilterComponent/filter.js';
import { NavBarComponent } from './components/NavBarComponent/navbar.js';
import { RestaurantCard } from './components/RestaurantCardComponent/restaurant-card.js';
import { GeolocationMapComponent } from './components/geolocation/geolocation.js';


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


const restaurants = [
  { name: "Antonio's Pizza", cuisine: "Pizza", price: "$", vegetarian: true, distance: 2 },
  { name: "Miss Saigon", cuisine: "Vietnamese", price: "$$", vegetarian: true, distance: 4 },
  { name: "Arigato", cuisine: "Japanese", price: "$$", vegetarian: true, distance: 6 },
];


// document.documentElement.innerHTML = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Filter Restaurant Recommendations</title>
//   <link rel="stylesheet" href="./components/FilterComponent/filter.css">
// </head>
// <body>
//   <div id="app"></div>
// </body>
// </html>
// `;

const filterComponent = new FilterComponent(restaurants);
app.appendChild(filterComponent.render());

const geolocationMap = new GeolocationMapComponent('map', 42.376800, -72.519444, 15);


const mapContainer = geolocationMap.render();
app.appendChild(mapContainer);


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
