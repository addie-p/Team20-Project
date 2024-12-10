export class SavedRestaurantsDashboard {
  #container = null;
  #likedRestaurants = [];
  #visitedRestaurants = [];

  constructor() {
    this.loadCSS();
    this.initialize();
  }

  // initialize by fetching liked restaurants and visited restaurants from tables from SQLite
  async initialize() {
    await this.fetchLikedRestaurants();
    await this.fetchVisitedRestaurants();
    this.displayRestaurants();
  }

  // fetching liked restaurants from backend liked restauranrs table
  async fetchLikedRestaurants() {
    try {
      const response = await fetch("/api/likedrestaurants"); //liked restaurants route
      if (!response.ok) throw new Error("Failed to fetch liked restaurants.");
      this.#likedRestaurants = await response.json(); // hold fetched data in this variable
      this.displayRestaurants();
    } catch (error) {
      console.error("Error fetching liked restaurants:", error);
    }
  }

  // fetching visited restaurants from backend visited restauranrs table
  async fetchVisitedRestaurants() {
    try {
      const response = await fetch("/api/visitedrestaurants");
      if (!response.ok) throw new Error("Failed to fetch visited restaurants.");
      this.#visitedRestaurants = await response.json();
      this.displayRestaurants();
    } catch (error) {
      console.error("Error fetching visited restaurants:", error);
    }
  }

  loadCSS() {
    const styleSheet = document.createElement("link");
    styleSheet.rel = "stylesheet";
    styleSheet.href =
      "components/SavedRestaurantsDashboard/SavedRestaurantsDashboard.css";
    document.head.appendChild(styleSheet);
  }

  // creating each restaurants card
  createRestaurantCard(restaurant, isVisited) {
    const card = document.createElement("div");
    card.classList.add("restaurant-card");
    if (isVisited) card.classList.add("visited-card");

    //add the image if it exists else have a placeholder
    const image = document.createElement("img");
    image.src = restaurant.image || "https://via.placeholder.com/150";
    image.alt = restaurant.name || "Restaurant Image";
    image.classList.add("restaurant-image");


    // info container having name and rating
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");

    const name = document.createElement("h3");
    name.textContent = restaurant.name || "Unknown Restaurant";
    name.classList.add("restaurant-name");

    const rating = document.createElement("p");
    rating.textContent = `⭐ ${restaurant.rating}`;
    rating.classList.add("restaurant-rating");

    infoContainer.appendChild(name);
    infoContainer.appendChild(rating);

    // if restaurant in visited section add a review link which links to review section
    if (isVisited) {
      const reviewLink = document.createElement("a");
      reviewLink.href = `./rating.html?restaurantId=${restaurant.id}&restaurantName=${encodeURIComponent(
        restaurant.name
      )}`;      
      reviewLink.classList.add("review-link");
      reviewLink.innerHTML = "&#8599;";
      infoContainer.appendChild(reviewLink);
    }

    // remove completely or remove from visited to liked restaurants
    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.classList.add("remove-button");
    removeButton.onclick = () => {
      if (isVisited) {
        this.moveToLiked(restaurant.id, restaurant);
      } else {
        this.removeLikedRestaurant(restaurant.id);
      }
    };

    card.appendChild(removeButton);
    card.appendChild(image);
    card.appendChild(infoContainer);

    // if in the liked section add option to move restaurant to visited section
    if (!isVisited) {
      const addToVisitedButton = document.createElement("button");
      addToVisitedButton.textContent = "+";
      addToVisitedButton.classList.add("add-to-visited");
      addToVisitedButton.onclick = () =>
        this.moveToVisited(restaurant.id, restaurant); // calls function to move to visited
      card.appendChild(addToVisitedButton);
    }

    return card;
  }

  // display all restaurants in its respective container
  displayRestaurants() {
    const likedContainer = this.#container.querySelector(
      "#likedRestaurantsGrid"
    );
    likedContainer.innerHTML = "";
    this.#likedRestaurants.forEach((restaurant) => {
      likedContainer.appendChild(this.createRestaurantCard(restaurant, false));
    });

    const visitedContainer = this.#container.querySelector(
      "#visitedRestaurantsGrid"
    );
    visitedContainer.innerHTML = "";
    this.#visitedRestaurants.forEach((restaurant) => {
      visitedContainer.appendChild(this.createRestaurantCard(restaurant, true));
    });
  }

  // removes from liked restaurants and adds to visited restaurants dynamically
  async moveToVisited(id, restaurant) {
    try {
      await fetch(`/api/likedrestaurants/${id}`, { method: "DELETE" }); // remove from liked restaurant table
      const addToVisitedResponse = await fetch("/api/visitedrestaurants", { // add to visited restaurant table
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurant),
      });
      if (!addToVisitedResponse.ok)
        throw new Error("Failed to add to visited restaurants.");
      // update both tables
      this.fetchLikedRestaurants();
      this.fetchVisitedRestaurants();
    } catch (error) {
      console.error("Error moving restaurant to visited:", error);
    }
  }
  // deletes from visited restaurants table and adds to liked restaurants table dynammically
  async moveToLiked(id, restaurant) {
    try {
      const response = await fetch(`/api/visitedrestaurants/${id}`, { // remove restaurant from visited restaurants
        method: "DELETE",
      });
      const r = await fetch("http://127.0.0.1:3000/api/likedrestaurants", { // add restaurant to liked restaurants
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restaurant),
      });

      if (!response.ok || !r.ok)
        throw new Error("Failed to move restaurant to liked.");
      // update both tables
      this.fetchLikedRestaurants();
      this.fetchVisitedRestaurants();
    } catch (error) {
      console.error("Error moving restaurant to liked:", error);
    }
  }

  async removeLikedRestaurant(id) {
    try {
      const response = await fetch(`/api/likedrestaurants/${id}`, { // delete a liked restaurant
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove liked restaurant.");
      this.fetchLikedRestaurants(); //update from backend
    } catch (error) {
      console.error("Error removing liked restaurant:", error);
    }
  }

  async removeVisitedRestaurant(id) {
    try {
      const response = await fetch(`/api/visitedrestaurants/${id}`, { // delete from visited restaurant
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove visited restaurant.");
      this.fetchVisitedRestaurants();
    } catch (error) {
      console.error("Error removing visited restaurant:", error);
    }
  }

  render() {
    //creating two sections and initializing the dashboard

    this.#container = document.createElement("div");
    this.#container.classList.add("dashboard-container");

    const likedSection = document.createElement("section");
    likedSection.classList.add("liked-section");
    likedSection.innerHTML = `<h2>Liked Restaurants</h2><div class="restaurant-grid" id="likedRestaurantsGrid"></div>`;
    this.#container.appendChild(likedSection);

    const visitedSection = document.createElement("section");
    visitedSection.classList.add("visited-section");
    visitedSection.innerHTML = `<h2>Visited Restaurants</h2><div class="restaurant-grid" id="visitedRestaurantsGrid"></div>`;
    this.#container.appendChild(visitedSection);

    this.initialize();

    return this.#container;
  }
}