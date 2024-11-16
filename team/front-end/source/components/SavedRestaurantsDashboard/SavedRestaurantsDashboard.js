import {
  getSavedRestaurants,
  saveRestaurant,
  removeRestaurant,
} from "../../services/indexeddb.js";

export class SavedRestaurantsDashboard {
  #container = null;
  #wantToTry = [];
  #visited = [];

  constructor() {
    this.loadCSS();
  }

  async initialize() {
    const allRestaurants = await getSavedRestaurants();

    this.#wantToTry = allRestaurants.filter(
      (restaurant) => !restaurant.visited
    );
    this.#visited = allRestaurants.filter((restaurant) => restaurant.visited);

    this.displayWantToTryRestaurants();
    this.displayVisitedRestaurants();
  }

  async saveData(restaurant) {
    await saveRestaurant(restaurant);
  }

  async removeData(id) {
    await removeRestaurant(id);
  }

  loadCSS() {
    const styleSheet = document.createElement("link");
    styleSheet.rel = "stylesheet";
    styleSheet.href =
      "components/SavedRestaurantsDashboard/SavedRestaurantsDashboard.css";
    document.head.appendChild(styleSheet);
  }

  // Save data to local storage for persistence
  saveDataToLocalStorage() {
    localStorage.setItem("wantToTry", JSON.stringify(this.#wantToTry));
    localStorage.setItem("visited", JSON.stringify(this.#visited));
  }

  createRestaurantCard(restaurant, isVisited) {
    const card = document.createElement("div");
    card.classList.add("restaurant-card");
    if (isVisited) card.classList.add("visited-card");

    const image = document.createElement("img");
    image.src = restaurant.imageUrl || "https://via.placeholder.com/150";
    image.alt = restaurant.name || "Restaurant Image";
    image.classList.add("restaurant-image");

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");

    const name = document.createElement("h3");
    name.textContent = restaurant.name || "Unknown Restaurant";
    name.classList.add("restaurant-name");

    const rating = document.createElement("p");
    rating.textContent = `⭐ ${"4"}`;
    rating.classList.add("restaurant-rating");

    infoContainer.appendChild(name);
    infoContainer.appendChild(rating);

    if (isVisited) {
      const reviewLink = document.createElement("a");
      reviewLink.href = "./rating.html";
      reviewLink.classList.add("review-link");
      reviewLink.innerHTML = "&#8599;";
      infoContainer.appendChild(reviewLink);
    }

    const removeButton = document.createElement("button");
    removeButton.textContent = isVisited ? "-" : "X";
    removeButton.classList.add("remove-button");
    removeButton.onclick = () => {
      if (isVisited) {
        this.moveToWantToTry(restaurant.id);
      } else {
        this.removeFromWantToTry(restaurant.id);
      }
    };

    card.appendChild(removeButton);
    card.appendChild(image);
    card.appendChild(infoContainer);

    if (!isVisited) {
      const addToVisitedButton = document.createElement("button");
      addToVisitedButton.textContent = "+";
      addToVisitedButton.classList.add("add-to-visited");
      addToVisitedButton.onclick = () => this.moveToVisited(restaurant.id);

      card.appendChild(addToVisitedButton);
    }

    return card;
  }

  displayWantToTryRestaurants() {
    const wantToTryGrid = this.#container.querySelector("#wantToTryGrid");
    wantToTryGrid.innerHTML = "";

    this.#wantToTry.forEach((restaurant) => {
      const card = this.createRestaurantCard(restaurant, false);
      wantToTryGrid.appendChild(card);
    });
  }

  displayVisitedRestaurants() {
    const visitedGrid = this.#container.querySelector("#visitedGrid");
    visitedGrid.innerHTML = "";

    this.#visited.forEach((restaurant) => {
      const card = this.createRestaurantCard(restaurant, true);
      visitedGrid.appendChild(card);
    });
  }

  async moveToVisited(id) {
    const index = this.#wantToTry.findIndex((r) => r.id === id);
    if (index > -1) {
      const [restaurant] = this.#wantToTry.splice(index, 1);
      restaurant.visited = true;
      this.#visited.push(restaurant);
      await this.saveData(restaurant);
      this.displayWantToTryRestaurants();
      this.displayVisitedRestaurants();
    }
  }

  async moveToWantToTry(id) {
    const index = this.#visited.findIndex((r) => r.id === id);
    if (index > -1) {
      const [restaurant] = this.#visited.splice(index, 1);
      restaurant.visited = false;
      this.#wantToTry.push(restaurant);
      await this.saveData(restaurant);
      this.displayWantToTryRestaurants();
      this.displayVisitedRestaurants();
    }
  }

  async removeFromWantToTry(id) {
    const index = this.#wantToTry.findIndex((r) => r.id === id);
    if (index > -1) {
      this.#wantToTry.splice(index, 1);
      await this.removeData(id);
      this.displayWantToTryRestaurants();
    }
  }

  render() {
    this.#container = document.createElement("div");
    this.#container.classList.add("dashboard-container");

    const wantToTrySection = document.createElement("section");
    wantToTrySection.classList.add("want-to-try-section");
    wantToTrySection.innerHTML = `<h2>Want to Try!</h2><div class="restaurant-grid" id="wantToTryGrid"></div>`;

    const visitedSection = document.createElement("section");
    visitedSection.classList.add("visited-section");
    visitedSection.innerHTML = `<h2>Visited!</h2><div class="restaurant-grid" id="visitedGrid"></div>`;

    this.#container.appendChild(wantToTrySection);
    this.#container.appendChild(visitedSection);

    this.initialize();

    return this.#container;
  }
}
