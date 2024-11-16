import { getSavedRestaurants } from '../../services/indexeddb.js';

export class RankingBracketSystem {
    //private properties
    #container = null;
    #currentPair = [];
    #lastVotedRestaurant = null;
    #restaurants = [];
    #savedContainer = null;

    constructor() {
        this.loadRestaurantsFromSaved();
        this.loadCSS();
    }

    // Load restaurants from savedRestaurantsDashboard (IndexedDB)
    async loadRestaurantsFromSaved() {
        try {
            this.#restaurants = await getSavedRestaurants(); // Load saved restaurants
            console.log('Voting options loaded:', this.#restaurants);

            if (this.#restaurants.length >= 2) {
                // Set initial voting pair if there are enough restaurants
                this.#currentPair = [this.#restaurants[0].name, this.#restaurants[1].name];
            } else {
                console.error('Not enough restaurants to set up voting pairs.');
                alert('Not enough saved restaurants to start voting.');
            }

            // Render only after loading data
            this.render();
        } catch (error) {
            console.error('Error loading saved restaurants:', error);
            alert('Failed to load saved restaurants.');
        }
    }

    // Load CSS
    loadCSS() {
        const styleSheet = document.createElement("link");
        styleSheet.rel = "stylesheet";
        styleSheet.href = "components/ranking_bracket_system/ranking_bracket_system.css";
        document.head.appendChild(styleSheet);
    }

    // Voting logic
    voteForRestaurant(restaurantName) {
        console.log(`Vote button clicked for ${restaurantName}`);
        alert(`You voted for ${restaurantName}`);
        this.#lastVotedRestaurant = restaurantName;

        // Increment vote count for the restaurant
        this.#restaurants.forEach(restaurant => {
            if (restaurant.name === restaurantName) {
                restaurant.votes++;
            }
        });
        this.updateToNextPair(restaurantName);
    }

    // Move to the next pair of restaurants
    updateToNextPair(votedRestaurantName) {
        let nextIndex = this.#restaurants.findIndex(r => r.name === this.#currentPair[1]) + 1;
        if (nextIndex < this.#restaurants.length) {
            let nextRestaurant = this.#restaurants[nextIndex];
            while (nextRestaurant && nextRestaurant.name === votedRestaurantName) {
                nextIndex++;
                nextRestaurant = this.#restaurants[nextIndex];
            }

            if (nextRestaurant) {
                this.#currentPair = [votedRestaurantName, nextRestaurant.name];
                this.#container.replaceWith(this.render());
            } else {
                this.showBestRestaurant();
            }
        } else {
            this.showBestRestaurant();
        }
    }

    // Show the best restaurant after voting
    showBestRestaurant() {
        if (this.#lastVotedRestaurant) {
            alert(`The best restaurant for you is ${this.#lastVotedRestaurant}!`);
        } else {
            alert('No votes recorded yet.');
        }
    }

    // Create a restaurant card with voting options
    createRestaurantCard(restaurantName) {
        const card = document.createElement('div');
        card.classList.add('restaurant');

        const name = document.createElement('h3');
        name.textContent = restaurantName;

        const voteButton = document.createElement('button');
        voteButton.textContent = `Vote for ${restaurantName}`;
        voteButton.onclick = () => this.voteForRestaurant(restaurantName);

        card.appendChild(name);
        card.appendChild(voteButton);

        return card;
    }

    render() {
        this.#container = document.createElement('div');
        this.#container.classList.add('container', 'matchup');

        if (this.#restaurants.length === 0) {
            this.#container.textContent = 'No restaurants available for voting.';
            return this.#container;
        }

        if (this.#currentPair.length === 0) {
            this.#container.textContent = 'No restaurants available for voting.';
            return this.#container;
        }

        const restaurant1 = this.createRestaurantCard(this.#currentPair[0]);
        const vsText = document.createElement('div');
        vsText.classList.add('vs');
        vsText.textContent = 'VS';
        const restaurant2 = this.createRestaurantCard(this.#currentPair[1]);

        this.#container.appendChild(restaurant1);
        this.#container.appendChild(vsText);
        this.#container.appendChild(restaurant2);

        return this.#container;
    }
}
