import { NavBarComponent } from '../NavBarComponent/navbar.js';
export class rating_system {
  #container = null;
  #db = null;
  #selectedRating = 0;

  constructor() {
    this.initializeDB(); 
    this.loadCSS(); 
    this.addBodyClickListener(); 
  }

  loadCSS() {
    const styleSheet = document.createElement("link");
    styleSheet.rel = "stylesheet";
    styleSheet.href = "./components/rating_system/rating_system.css"; 
    document.head.appendChild(styleSheet);
  }

  initializeDB() {
    //initializes indexedDB for storing reviews
    const request = indexedDB.open("PlatefulDB", 1);
    request.onupgradeneeded = (event) => {
      this.#db = event.target.result;
      const objectStore = this.#db.createObjectStore("reviews", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("restaurantName", "restaurantName", { unique: false });
    };
    request.onsuccess = (event) => {
      this.#db = event.target.result;
    };
    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event.target.errorCode);
    };
  }

  updateStars(container, rating) {
    container.querySelectorAll('.rating span').forEach((star, index) => {
      star.classList.toggle('selected', index < rating);
    });
  }

  handleStarClick(container, index) {
    // handles clicking on star and updates the selected rating
    this.#selectedRating = index + 1;
    this.updateStars(container, this.#selectedRating);
  }

  handleSubmit(event) {
    // stores the review in IndexedDB
    event.preventDefault();

    const restaurantName = event.target.querySelector("#restaurantName").value;
    const reviewText = event.target.querySelector("#reviewText").value;

    if (this.#selectedRating === 0) {
      alert("Please select a star rating.");
      return;
    }

    // new transaction to store the review
    const transaction = this.#db.transaction(["reviews"], "readwrite");
    const objectStore = transaction.objectStore("reviews");
    const review = {
      restaurantName,
      reviewText,
      rating: this.#selectedRating,
      date: new Date(),
    };

    objectStore.add(review);
    console.log(review);

    transaction.oncomplete = () => {
      alert("Review added successfully!");
      event.target.reset();
      this.updateStars(event.target, 0); // resetrs star rating
      this.#selectedRating = 0; 
    };

    transaction.onerror = (event) => {
      console.error("Error adding review:", event.target.error);
    };
  }


  addBodyClickListener() {
    // listener to handle clicks outside of the dropdown menu
    document.body.addEventListener("click", (event) => this.handleBodyClick(event));
  }

  handleUploadButtonClick() {
    // redirect to Helen's upload page
    window.location.href = "./upload.html";
  }

  render() {
    const full_container = document.createElement('div');
    const navBar = new NavBarComponent();
    full_container.appendChild(navBar.render());

    // render rating system component
    this.#container = document.createElement("div");
    this.#container.classList.add("container");

    // render HTML 
    this.#container.innerHTML = `
      <div class="header-container">
        <h1>Plateful</h1>
        <h2>Review Your Favorite Restaurants</h2>
        <div class="upload-button" onclick="window.location.href='./upload.html'">
          <div class="upload-button-icon">&#8682;</div>
          <div class="upload-button-text">Upload your pictures</div>
        </div>
      </div>
      <div class="left-content">
        <form id="reviewForm">
          <label for="restaurantName">Restaurant Name:</label>
          <input type="text" id="restaurantName" placeholder="e.g., Miss Saigon" required>

          <label for="reviewText">Review:</label>
          <textarea id="reviewText" placeholder="Write your review here..." rows="4" required></textarea>

          <div class="rating">
            <span data-star="5">&#9733;</span>
            <span data-star="4">&#9733;</span>
            <span data-star="3">&#9733;</span>
            <span data-star="2">&#9733;</span>
            <span data-star="1">&#9733;</span>
          </div>

          <button type="submit">Submit Review</button>
        </form>
      </div>
      <div class="right-content">
      </div>
    `;

    //event listeners to stars
    const stars = this.#container.querySelectorAll(".rating span");
    stars.forEach((star, index) => {
      star.addEventListener("click", () => this.handleStarClick(this.#container, index));
      star.addEventListener("mouseover", () => this.updateStars(this.#container, index + 1));
    });

    // rsets stars when mouse leaves the rating area
    this.#container.querySelector(".rating").addEventListener("mouseleave", () => {
      this.updateStars(this.#container, this.#selectedRating);
    });

    //event listener for form submission
    this.#container.querySelector("#reviewForm").addEventListener("submit", this.handleSubmit.bind(this));
    
    full_container.appendChild(this.#container);
    return full_container;
  }
}
