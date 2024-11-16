export class RankingBracketSystem {
        // Private properties
        #container = null;
        #currentPair = [];
        #lastVotedRestaurant = null;
        #restaurants = [];
        #savedRestaurants = [];
    
        constructor() {
            // Load saved restaurants from localStorage
            this.#savedRestaurants = JSON.parse(localStorage.getItem("savedRestaurants")) || [];
    
            // Normalize saved restaurant objects to ensure a consistent structure
            this.#restaurants = this.#savedRestaurants.map((restaurant) => ({
                id: restaurant.id || "unknown",
                name: restaurant.name || restaurant.Restaurant || "Unknown Restaurant",
                cuisine: restaurant.cuisine || restaurant.Cuisine || "Not specified",
                price: restaurant.price || restaurant.Price || "N/A",
                votes: 0,
            }));
    
            // Set the first pair if there are at least 2 restaurants
            if (this.#restaurants.length >= 2) {
                this.#currentPair = [this.#restaurants[0], this.#restaurants[1]];
            }
    
            // Load CSS
            this.loadCSS();
        }
    
        // Function to load CSS
        loadCSS() {
            const styleSheet = document.createElement("link");
            styleSheet.rel = "stylesheet";
            styleSheet.href = "components/ranking_bracket_system/ranking_bracket_system.css";
            document.head.appendChild(styleSheet);
        }
    
        // Voting logic for a restaurant
        voteForRestaurant(restaurantName) {
            console.log(`Vote button clicked for ${restaurantName}`);
            alert(`You voted for ${restaurantName}`);
            this.#lastVotedRestaurant = restaurantName;
    
            // Increment the votes for the selected restaurant
            this.#restaurants.forEach((restaurant) => {
                if (restaurant.name === restaurantName) {
                    restaurant.votes++;
                }
            });
    
            // Move to the next pair
            this.updateToNextPair(restaurantName);
        }
    
        // Move to the next pair of restaurants
        updateToNextPair(votedRestaurantName) {
            let nextIndex = this.#restaurants.findIndex((r) => r.name === this.#currentPair[1]?.name) + 1;
    
            if (nextIndex < this.#restaurants.length) {
                let nextRestaurant = this.#restaurants[nextIndex];
                while (nextRestaurant && nextRestaurant.name === votedRestaurantName) {
                    nextIndex++;
                    nextRestaurant = this.#restaurants[nextIndex];
                }
    
                if (nextRestaurant) {
                    this.#currentPair = [votedRestaurantName, nextRestaurant];
                    this.#container.replaceWith(this.render());
                } else {
                    this.showBestRestaurant();
                }
            } else {
                this.showBestRestaurant();
            }
        }
    
        // After the last vote, display the best restaurant
        showBestRestaurant() {
            if (this.#lastVotedRestaurant) {
                alert(`The best restaurant for you is ${this.#lastVotedRestaurant}!`);
            } else {
                alert("No votes recorded yet.");
            }
        }
    
        // Create card elements for restaurants with voting and saving options
        createRestaurantCard(restaurant) {
            if (!restaurant || !restaurant.name) {
                console.error("Invalid restaurant object:", restaurant);
                return document.createElement("div"); // Return an empty div to prevent crashes
            }
    
            const card = document.createElement("div");
            card.classList.add("restaurant");
    
            const name = document.createElement("h3");
            name.textContent = restaurant.name;
    
            const details = document.createElement("p");
            details.textContent = `Cuisine: ${restaurant.cuisine} | Price: ${restaurant.price}`;
    
            const voteButton = document.createElement("button");
            voteButton.textContent = `Vote for ${restaurant.name}`;
            voteButton.onclick = () => this.voteForRestaurant(restaurant.name);
    
            card.appendChild(name);
            card.appendChild(details);
            card.appendChild(voteButton);
    
            return card;
        }
    
        render() {
            this.#container = document.createElement("div");
            this.#container.classList.add("container", "matchup");
    
            if (this.#restaurants.length === 0) {
                this.#container.textContent = "No restaurants available for voting.";
                return this.#container;
            }
    
            if (this.#currentPair.length === 0) {
                this.#container.textContent = "No restaurants available for voting.";
                return this.#container;
            }
    
            // Create and add restaurant cards and the "VS" text
            const restaurant1 = this.createRestaurantCard(this.#currentPair[0]);
            const vsText = document.createElement("div");
            vsText.classList.add("vs");
            vsText.textContent = "VS";
            const restaurant2 = this.createRestaurantCard(this.#currentPair[1]);
    
            this.#container.appendChild(restaurant1);
            this.#container.appendChild(vsText);
            this.#container.appendChild(restaurant2);
    
            return this.#container;
        }
    }