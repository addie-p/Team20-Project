import { NavBarComponent } from './components/NavBarComponent/navbar.js';
import { RestaurantCard } from './components/RestaurantCardComponent/restaurant-card.js';

const app = document.getElementById('app');
if (!app) {
    console.error("App container with id 'app' not found.");
} else {
    const navBar = new NavBarComponent();
    app.appendChild(navBar.render());

    renderRestaurantCards('restaurant-container');
}

async function renderRestaurantCards(containerId) {
    try {
        const restaurantData = await fetchCSV();
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container with id "${containerId}" not found.`);
            return;
        }

        restaurantData.forEach(data => {
            const card = new RestaurantCard(data);
            container.appendChild(card.render());
        });
    } catch (error) {
        console.error('Error rendering restaurant cards:', error);
    }
}

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
