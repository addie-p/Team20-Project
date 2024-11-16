export class RankingBracketSystem {
    //private properties
     #container = null;
     #currentPair = [];
     #lastVotedRestaurant = null;
     #restaurants = [];
     #savedRestaurants = [];
     #savedContainer = null;
  
  
     constructor(restaurants = []) {
         //initialize list of restauratns and load the saved restaurants
         this.#restaurants = restaurants;
         this.#savedRestaurants = JSON.parse(localStorage.getItem("savedRestaurants")) || [];
         //if there are 2 or more restaurants, then set the first two pairs for voting
         if (this.#restaurants.length >= 2) {
             this.#currentPair = [this.#restaurants[0].name, this.#restaurants[1].name];
         }
         // call to get CSS
         this.loadCSS();
     }
  
     //function that gets the CSS 
     loadCSS() {
         const styleSheet = document.createElement("link");
         styleSheet.rel = "stylesheet";
         styleSheet.href = "components/ranking_bracket_system/ranking_bracket_system.css";
         document.head.appendChild(styleSheet);
         }
 
  
     //voting logic for restaurant
     voteForRestaurant(restaurantName) {
         console.log(`Vote button clicked for ${restaurantName}`);
         alert(`You voted for ${restaurantName}`);
         this.#lastVotedRestaurant = restaurantName;
  
         //increase the number of votes for restaurant
         this.#restaurants.forEach(restaurant => {
             if (restaurant.name === restaurantName) {
                 restaurant.votes++;
             }
         });
         //move to next two restaurants
         this.updateToNextPair(restaurantName);
     }
  
     //save a restaurant to list of saved restaurants and updates storage
     saveRestaurant(restaurantName) {
         if (!this.#savedRestaurants.includes(restaurantName)) {
             this.#savedRestaurants.push(restaurantName);
             localStorage.setItem("savedRestaurants", JSON.stringify(this.#savedRestaurants));
             alert(`Restaurant ${restaurantName} saved.`);
         } else {
             alert(`${restaurantName} is already in your saved list.`);
         }
     }
  
     //shows the saved restauratns 
     showSavedRestaurants() {
         if (!this.#savedContainer) {
             this.#savedContainer = document.createElement('div');
             this.#savedContainer.classList.add('saved-restaurants');
             this.#savedContainer.id = 'savedRestaurantsContainer';
             this.#savedContainer.innerHTML = '<h3>Saved Restaurants</h3>';
         } else {
             this.#savedContainer.innerHTML = '<h3>Saved Restaurants</h3>';
         }
  
         //list of the saved restaurants 
         const list = document.createElement('ul');
         this.#savedRestaurants.forEach(name => {
             const li = document.createElement('li');
             li.textContent = name;
             //if restaurant is clicked, then gives option to delete from saved list
             li.onclick = () => {
                 const confirmDelete = confirm(`Are you sure you want to delete ${name}?`);
                 if (confirmDelete) {
                     this.deleteRestaurant(name);
                 }
             };
             list.appendChild(li);
         });
  
  
         this.#savedContainer.appendChild(list);
 
         // button for hide saved restauratns 
         const hideButton = document.createElement('button');
         hideButton.textContent = 'Hide Saved Restaurants';
         hideButton.onclick = () => this.hideSavedRestaurants();
         this.#savedContainer.appendChild(hideButton);
  
         this.#container.appendChild(this.#savedContainer);
     }
  
 
     //removes a saved restaurant 
     hideSavedRestaurants() {
         if (this.#savedContainer) {
             this.#savedContainer.remove();
             this.#savedContainer = null;
         }
     }
  
     //deletes a restaurant from saved list and updates storage
     deleteRestaurant(restaurantName) {
         this.#savedRestaurants = this.#savedRestaurants.filter(name => name !== restaurantName);
         localStorage.setItem("savedRestaurants", JSON.stringify(this.#savedRestaurants));
         alert(`Restaurant ${restaurantName} deleted.`);
         this.showSavedRestaurants(); 
     }
  
  //function that moves to next pair of restaurants 
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
                 //this.#container.innerHTML = ''; 
                 //this.#container.appendChild(this.render()); 
                 this.#container.replaceWith(this.render());
 
             } else {
                 this.showBestRestaurant();
             }
         } else {
             this.showBestRestaurant();
         }
     }
  
  
         //after last vote, that restaurant is the one that's the best option
     showBestRestaurant() {
         if (this.#lastVotedRestaurant) {
             alert(`The best restaurant for you is ${this.#lastVotedRestaurant}!`);
         } else {
             alert('No votes recorded yet.');
         }
     }
  
     //creates card element for restaurant with voting and saving options
     createRestaurantCard(restaurantName) {
         const card = document.createElement('div');
         card.classList.add('restaurant');
  
  
         const name = document.createElement('h3');
         name.textContent = restaurantName;
  
  
         const voteButton = document.createElement('button');
         voteButton.textContent = `Vote for ${restaurantName}`;
         voteButton.onclick = () => this.voteForRestaurant(restaurantName);
  
  
         const saveButton = document.createElement('button');
         saveButton.textContent = `Save ${restaurantName}`;
         saveButton.onclick = () => this.saveRestaurant(restaurantName);
  
  
         card.appendChild(name);
         card.appendChild(voteButton);
         card.appendChild(saveButton);
  
  
         return card;
     }
  
  
     render() {
         this.#container = document.createElement('div');
         this.#container.classList.add('container', 'matchup');
     
         // Debugging: Output the current state of restaurants and currentPair
         console.log('Restaurants:', this.#restaurants);
         console.log('Current Pair:', this.#currentPair);
     
         if (this.#restaurants.length === 0) {
             this.#container.textContent = 'No restaurants available for voting.';
             return this.#container;
         }
     
         if (this.#currentPair.length === 0) {
             this.#container.textContent = 'No restaurants available for voting.';
             return this.#container;
         }
     
         // Create and add restaurant cards and the VS
         const restaurant1 = this.createRestaurantCard(this.#currentPair[0]);
         const vsText = document.createElement('div');
         vsText.classList.add('vs');
         vsText.textContent = 'VS';
         const restaurant2 = this.createRestaurantCard(this.#currentPair[1]);
     
         this.#container.appendChild(restaurant1);
         this.#container.appendChild(vsText);
         this.#container.appendChild(restaurant2);
     
         const showSavedButton = document.createElement('button');
         showSavedButton.textContent = 'Show Saved Restaurants';
         showSavedButton.onclick = () => this.showSavedRestaurants();
         this.#container.appendChild(showSavedButton);
     
         return this.#container;
     }
     
  }
  