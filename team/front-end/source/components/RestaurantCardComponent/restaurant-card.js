export class RestaurantCard {
    constructor(restaurantData) {
        this.restaurantData = restaurantData;
        this.cardElement = null;
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
        image.src = 'https://via.placeholder.com/300x150?text=Restaurant+Image'; // Placeholder for restaurant images
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

        card.appendChild(content);
        this.cardElement = card; // Store a reference to the card element
        return card;
    }

    addSwipeListeners({ onLike, onDislike }) {
        if (!this.cardElement) return;

        const cardElement = this.cardElement;
        let startX = 0;
        let currentX = 0;

        const handleStart = (e) => {
            startX = e.touches[0].clientX;
        };

        const handleMove = (e) => {
            currentX = e.touches[0].clientX - startX;
            cardElement.style.transform = `translateX(${currentX}px)`;
        };

        const handleEnd = () => {
            if (currentX > 150) {
                onLike(); // Swiped right
            } else if (currentX < -150) {
                onDislike(); // Swiped left
            } else {
                cardElement.style.transform = ''; // Reset position
            }
            startX = 0;
            currentX = 0;
        };

        cardElement.addEventListener('touchstart', handleStart);
        cardElement.addEventListener('touchmove', handleMove);
        cardElement.addEventListener('touchend', handleEnd);
    }
}
