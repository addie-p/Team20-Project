import { NavBarComponent } from '../NavBarComponent/navbar.js';
export class rating_system {
  #container = null;
  #db = null;
  #selectedRating = 0;
  #restaurantId = null;
  #restaurantName = null;

  constructor({ id, name }) { 
    this.#restaurantId = id;
    this.#restaurantName = name;
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
    // initializes IndexedDB for storing reviews and restaurants
    const request = indexedDB.open("PlatefulDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
  
      if (!db.objectStoreNames.contains("reviews")) {
        const reviewStore = db.createObjectStore("reviews", { keyPath: "id", autoIncrement: true });
        reviewStore.createIndex("restaurantName", "restaurantName", { unique: false });
      }
  
      if (!db.objectStoreNames.contains("restaurants")) {
        db.createObjectStore("restaurants", { keyPath: "id" });
      }
    };
  
    request.onsuccess = (event) => {
      this.#db = event.target.result;
      this.populateRestaurantName();
    };
  
    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event.target.errorCode);
    };
  }

  populateRestaurantName() {
    const restaurantNameInput = this.#container.querySelector("#restaurantName");
    const reviewTextInput = this.#container.querySelector("#reviewText");
    const starsContainer = this.#container.querySelector(".rating");
  
    if (restaurantNameInput) {
      restaurantNameInput.value = this.#restaurantName;
      restaurantNameInput.disabled = true; 
    }
  
    // get existing review from IndexedDB
    const transaction = this.#db.transaction(["reviews"], "readonly");
    const reviewStore = transaction.objectStore("reviews");
    const index = reviewStore.index("restaurantName");
    const request = index.get(this.#restaurantName);
  
    request.onsuccess = () => {
      const review = request.result;
      if (review) {
        // prefill review text and star rating
        if (reviewTextInput) {
          reviewTextInput.value = review.reviewText;
        }
        if (starsContainer) {
          this.#selectedRating = review.rating;
          this.updateStars(starsContainer, this.#selectedRating);
        }
      }
    };
  
    request.onerror = (event) => {
      console.error("Error fetching review:", event.target.errorCode);
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
    event.preventDefault();
  
    const restaurantName = event.target.querySelector("#restaurantName").value;
    const reviewText = event.target.querySelector("#reviewText").value;
  
    if (this.#selectedRating === 0) {
      alert("Please select a star rating.");
      return;
    }
  
    const review = {
      restaurantName,
      reviewText,
      rating: this.#selectedRating,
      date: new Date(),
    };
  
    // save/update the review in IndexedDB
    const transaction = this.#db.transaction(["reviews"], "readwrite");
    const reviewStore = transaction.objectStore("reviews");
    const index = reviewStore.index("restaurantName");
    const getRequest = index.get(restaurantName);
  
    getRequest.onsuccess = () => {
      if (getRequest.result) {
        // update existing review
        review.id = getRequest.result.id; 
        reviewStore.put(review);
      } else {
        reviewStore.add(review);
      }
    };
  
    transaction.oncomplete = () => {
      alert("Review saved successfully!");
    };
  
    transaction.onerror = (event) => {
      console.error("Error saving review:", event.target.error);
    };
  }
  


  addBodyClickListener() {
    // listener to handle clicks outside of the dropdown menu
    document.body.addEventListener("click", (event) => this.handleBodyClick(event));
  }

  handleUploadButtonClick() {
    // redirect to Helen's upload page
    window.location.href = `./upload.html?restaurantId=${this.#restaurantId}`;
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
