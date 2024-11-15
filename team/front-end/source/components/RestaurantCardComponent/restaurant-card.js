export class RestaurantCard {
    constructor(restaurantData) {
        this.restaurantData = restaurantData;
    }

    loadCSS() {
        const styleSheet = document.createElement("link");
        styleSheet.rel = "stylesheet";
        styleSheet.href = "components/RestaurantCardComponent/restaurant-card.css";
        document.head.appendChild(styleSheet);
    }

    render() {
        this.loadCSS();

        const card = document.createElement('div');
        card.classList.add('restaurant-card');

        const image = document.createElement('img');
        image.src = 'https://via.placeholder.com/300x150?text=Restaurant+Image';
        image.alt = `${this.restaurantData.Restaurant}`;
        card.appendChild(image);

        const content = document.createElement('div');
        content.classList.add('restaurant-card-content');

        const title = document.createElement('h3');
        title.classList.add('restaurant-card-title');
        title.textContent = this.restaurantData.Restaurant;
        content.appendChild(title);

        const details = document.createElement('p');
        details.classList.add('restaurant-card-details');
        details.innerHTML = `
            <span>Cuisine:</span> ${this.restaurantData.Cuisine}<br>
            <span>Price:</span> ${this.restaurantData.Price}<br>
            <span>Vegetarian:</span> ${this.restaurantData.Vegetarian}<br>
            <span>Location:</span> ${this.restaurantData.Town}, ${this.restaurantData.State}<br>
            <span>Distance:</span> ${this.restaurantData.Distance} miles
        `;
        content.appendChild(details);

        const footer = document.createElement('div');
        footer.classList.add('restaurant-card-footer');
        footer.textContent = 'Click for more details';
        content.appendChild(footer);

        card.appendChild(content);
        return card;
    }
}

async function fetchCSV() {
    const response = await fetch('components/restaurants.csv');
    const data = await response.text();
    return parseCSV(data);
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

async function renderRestaurantCards(containerId) {
    const restaurantData = await fetchCSV();
    const container = document.getElementById(containerId);

    restaurantData.forEach(data => {
        const card = new RestaurantCard(data);
        container.appendChild(card.render());
    });
}

renderRestaurantCards('restaurant-container');

