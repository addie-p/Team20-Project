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
    this.#selectedRating = index + 1;
    this.updateStars(container, this.#selectedRating);
  }

  handleSubmit(event) {
    event.preventDefault();

    const restaurantName = event.target.querySelector("#restaurantName").value;
    const reviewText = event.target.querySelector("#reviewText").value;

    if (this.#selectedRating === 0) {
      alert("Please select a star rating.");
      return;
    }

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
      this.updateStars(event.target, 0);
      this.#selectedRating = 0;
    };

    transaction.onerror = (event) => {
      console.error("Error adding review:", event.target.error);
    };
  }

  handleMenuClick() {
    const dropdown = document.querySelector(".menu-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }

  handleBodyClick(event) {
    const dropdown = document.querySelector(".menu-dropdown");
    const menuButton = document.querySelector(".menu-button");
    if (dropdown.style.display === "block" && !dropdown.contains(event.target) && event.target !== menuButton) {
      dropdown.style.display = "none";
    }
  }

  addBodyClickListener() {
    document.body.addEventListener("click", (event) => this.handleBodyClick(event));
  }

  handleUploadButtonClick() {
    window.location.href = "./upload.html";
  }

  render() {
    this.#container = document.createElement("div");
    this.#container.classList.add("container");

    this.#container.innerHTML = `
      <button class="menu-button">&#9776;</button>
      <div class="menu-dropdown">
        <a href="#">Page 1</a>
        <a href="#">Page 2</a>
        <a href="#">Page 3</a>
      </div>
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

    const stars = this.#container.querySelectorAll(".rating span");
    stars.forEach((star, index) => {
      star.addEventListener("click", () => this.handleStarClick(this.#container, index));
      star.addEventListener("mouseover", () => this.updateStars(this.#container, index + 1));
    });

    this.#container.querySelector(".rating").addEventListener("mouseleave", () => {
      this.updateStars(this.#container, this.#selectedRating);
    });

    this.#container.querySelector("#reviewForm").addEventListener("submit", this.handleSubmit.bind(this));
    this.#container.querySelector(".menu-button").addEventListener("click", this.handleMenuClick);

    return this.#container;
  }
}