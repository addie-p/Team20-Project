export class SavedRestaurantsDashboard {
  #container = null;
  #wantToTry = [];
  #visited = [];

  constructor() {
    // restaurants in want to try section
    this.#wantToTry = JSON.parse(localStorage.getItem("wantToTry")) || [
      {
        id: 1,
        name: "Miss Saigon",
        rating: 4.5,
        imageUrl:
          "https://www.stonehousefarmbb.com/images/Restaurants/d7c5c347-282a-444a-8012-663ec3256160.jpg",
      },
      {
        id: 2,
        name: "Antonios",
        rating: 4,
        imageUrl:
          "https://www.andiemitchell.com/wp-content/uploads/2012/10/antonios-pizza-amherst-ma.jpg",
      },
      {
        id: 3,
        name: "Arigato",
        rating: 5,
        imageUrl:
          "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/ff/68/3d/teriyaki-salmon-bento.jpg?w=1400&h=-1&s=1",
      },
    ];
    // restaurants in visited section
    this.#visited = JSON.parse(localStorage.getItem("visited")) || [];
    this.loadCSS();
  }

  loadCSS() {
    const styleSheet = document.createElement("link");
    styleSheet.rel = "stylesheet";
    styleSheet.href =
      "components/SavedRestaurantsDashboard/SavedRestaurantsDashboard.css";
    document.head.appendChild(styleSheet);
  }

  // data saved so on refresh it is saved
  saveData() {
    localStorage.setItem("wantToTry", JSON.stringify(this.#wantToTry));
    localStorage.setItem("visited", JSON.stringify(this.#visited));
  }

  // function to create restaurant card
  createRestaurantCard(restaurant, isVisited) {
    const card = document.createElement("div");
    card.classList.add("restaurant-card");
    if (isVisited) card.classList.add("visited-card");

    const image = document.createElement("img");
    image.src = restaurant.imageUrl;
    image.alt = restaurant.name;
    image.classList.add("restaurant-image");

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");

    const name = document.createElement("h3");
    name.textContent = restaurant.name;
    name.classList.add("restaurant-name");

    const rating = document.createElement("p");
    rating.textContent = `⭐ ${restaurant.rating}`;
    rating.classList.add("restaurant-rating");

    infoContainer.appendChild(name);
    infoContainer.appendChild(rating);

    // link to review system if restaurant is in visited section
    if (isVisited) {
      const reviewLink = document.createElement("a");
      reviewLink.href = "./rating.html"; // for the review system
      reviewLink.classList.add("review-link");
      reviewLink.innerHTML = "&#8599;";
      infoContainer.appendChild(reviewLink);
    }

    // to remove restaurant completely or move back to want to try if user misclicked
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

    // if in want to try add option to move restaurant card to visited section
    if (!isVisited) {
      const addToVisitedButton = document.createElement("button");
      addToVisitedButton.textContent = "+";
      addToVisitedButton.classList.add("add-to-visited");
      addToVisitedButton.onclick = () => this.moveToVisited(restaurant.id);

      card.appendChild(addToVisitedButton);
    }

    return card;
  }

  // display all restaurants

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

  // moving restaurants functions
  moveToVisited(id) {
    const index = this.#wantToTry.findIndex((r) => r.id === id);
    if (index > -1) {
      const [restaurant] = this.#wantToTry.splice(index, 1);
      this.#visited.push(restaurant);
      this.saveData();
      this.displayWantToTryRestaurants();
      this.displayVisitedRestaurants();
    }
  }

  moveToWantToTry(id) {
    const index = this.#visited.findIndex((r) => r.id === id);
    if (index > -1) {
      const [restaurant] = this.#visited.splice(index, 1);
      this.#wantToTry.push(restaurant);
      this.saveData();
      this.displayWantToTryRestaurants();
      this.displayVisitedRestaurants();
    }
  }

  removeFromWantToTry(id) {
    const index = this.#wantToTry.findIndex((r) => r.id === id);
    if (index > -1) {
      this.#wantToTry.splice(index, 1);
      this.saveData();
      this.displayWantToTryRestaurants();
    }
  }
  // render all
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

    this.displayWantToTryRestaurants();
    this.displayVisitedRestaurants();

    return this.#container;
  }
}
