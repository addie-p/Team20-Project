export class RankingBracketSystem {
    #container = null;
    #currentPair = [];
    #lastVotedRestaurant = null;
    #restaurants = [];
    #savedRestaurants = [];

    constructor() {
        // load saved restaurants from localStorage, should access data from "yeses" that they wanted
        this.#savedRestaurants = JSON.parse(localStorage.getItem("savedRestaurants")) || [];

        // normalize saved restaurant objects so that it's consistent. 
        this.#restaurants = this.#savedRestaurants.map((restaurant) => ({
            id: restaurant.id || "unknown",
            name: restaurant.name || restaurant.Restaurant || "Unknown Restaurant",
            cuisine: restaurant.cuisine || restaurant.Cuisine || "Not specified",
            price: restaurant.price || restaurant.Price || "N/A",
            votes: 0,
        }));

        //if there are more than 2 restaurants, then there are restaurants the user can voe on so display them
        if (this.#restaurants.length >= 2) {
            this.#currentPair = [this.#restaurants[0], this.#restaurants[1]];
        }

        // load CSS
        this.loadCSS();
    }

    // get CSS from ranking_bracket_system.css
    loadCSS() {
        const styleSheet = document.createElement("link");
        styleSheet.rel = "stylesheet";
        styleSheet.href = "components/ranking_bracket_system/ranking_bracket_system.css";
        document.head.appendChild(styleSheet);
    }


    //voting for restaurant
    voteForRestaurant(restaurantName) {
        console.log(`Vote button clicked for ${restaurantName}`);
        alert(`You voted for ${restaurantName}`);
        this.#lastVotedRestaurant = restaurantName;

        // increase the votes for the selected restaurant
        this.#restaurants.forEach((restaurant) => {
            if (restaurant.name === restaurantName) {
                restaurant.votes++;
            }
        });

        // move to next two restauratn options 
        this.updateToNextPair(restaurantName);
    }

    // Move to the next two  restaurants
    updateToNextPair(votedRestaurantName) {
        // find index of last restaurant in the current pair
        let currentIndex = this.#restaurants.findIndex((r) => r.name === this.#currentPair[1]?.name);
    
        // make sure next index exists
        if (currentIndex + 1 < this.#restaurants.length) {
            let nextRestaurant = this.#restaurants[currentIndex + 1];
    
            // don't infinite loop or reuse the voted restaurant as the second option
            while (nextRestaurant && nextRestaurant.name === votedRestaurantName) {
                currentIndex++;
                nextRestaurant = this.#restaurants[currentIndex + 1];
            }
    
            if (nextRestaurant) {
                // new restaurant replaces restaurant not voted for
                this.#currentPair = [
                    this.#restaurants.find((r) => r.name === votedRestaurantName),
                    nextRestaurant
                ];
                // re-render container 
                this.#container.replaceWith(this.render());
            } else {
                // no more restaurants 
                this.showBestRestaurant();
            }
        } else {
            // no more restaurants
            this.showBestRestaurant();
        }
    }
    
    // the best restaurant is the last restaurant that's voted for 
    showBestRestaurant() {
        if (this.#lastVotedRestaurant) {
            alert(`The best restaurant for you is ${this.#lastVotedRestaurant}!`);
        } else {
            alert("No votes recorded yet.");
        }
    }

    // create cards for each restaurant with vote option
    createRestaurantCard(restaurant) {
        if (!restaurant || !restaurant.name) {
            console.error("Invalid restaurant object:", restaurant);
            return document.createElement("div"); 
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
        // reset the container
        if (this.#container) {
            this.#container.innerHTML = '';
        } else {
            this.#container = document.createElement("div");
            this.#container.classList.add("container", "matchup");
        }

        if (this.#restaurants.length === 0) {
            this.#container.textContent = "No restaurants available for voting.";
            return this.#container;
        }

        if (this.#currentPair.length === 0) {
            this.#container.textContent = "No restaurants available for voting.";
            return this.#container;
        }

        // Add the restaurant cards and vs text 
        const restaurant1 = this.createRestaurantCard(this.#currentPair[0]);
        const vsText = document.createElement("div");
        vsText.classList.add("vs");
        vsText.textContent = "VS";
        const restaurant2 = this.createRestaurantCard(this.#currentPair[1]);

        this.#container.appendChild(restaurant1);
        this.#container.appendChild(vsText);
        this.#container.appendChild(restaurant2);

        document.body.appendChild(this.#container);

        return this.#container;
    }
}
