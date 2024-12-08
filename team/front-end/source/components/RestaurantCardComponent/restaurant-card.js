export class RestaurantCard {
  constructor(restaurantData) {
    this.restaurantData = restaurantData;
    this.cardElement = null;
    this.onLikeCallback = null;
    this.onDislikeCallback = null;
  }

  loadCSS() {
    const styleSheet = document.createElement("link");
    styleSheet.rel = "stylesheet";
    styleSheet.href = "components/RestaurantCardComponent/restaurant-card.css";
    document.head.appendChild(styleSheet);
  }

  render() {
    this.loadCSS();
  
    const card = document.createElement("div");
    card.classList.add("restaurant-card");
  
    console.log(this.restaurantData); // Debugging info
  
    const image = document.createElement("img");
    image.src = this.restaurantData.image || "default-image-url.jpg"; 
    image.alt = this.restaurantData.name || "Restaurant";
    card.appendChild(image);
  
    const content = document.createElement("div");
    content.classList.add("restaurant-card-content");
  
    const title = document.createElement("h3");
    title.classList.add("restaurant-card-title");
    title.textContent = this.restaurantData.name || "Unknown Restaurant";
    content.appendChild(title);

    // to convert price as a number to be as many $'s as the price (ex. 3 === $$$, 2 === $$. 1 === $)
    let r = "";
    if(this.restaurantData.price !== undefined) {
      console.log(this.restaurantData.price)
      for(let i=0; i < this.restaurantData.price; i++)
        {
          r += "$"
        }
        
    }    
  
    const details = document.createElement("p");
    details.classList.add("restaurant-card-details");
    details.innerHTML = `
      <span>Cuisine:</span> ${this.restaurantData.cuisine || "Not specified"}<br>
      <span>Price:</span> ${r}<br>
      <span>Vegetarian:</span> ${this.restaurantData.vegetarian || "Not specified"} <br>
      <span>Location:</span> ${this.restaurantData.full_address || "Not specified"}<br>
      <span>Distance:</span> ${this.restaurantData.distance || "Unknown"} miles
    `;
    content.appendChild(details);
  
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("restaurant-card-buttons");
  
    const dislikeButton = document.createElement("button");
    dislikeButton.classList.add("dislike-button");
    dislikeButton.textContent = "Dislike";
    dislikeButton.addEventListener("click", () => this.onDislike());
  
    const likeButton = document.createElement("button");
    likeButton.classList.add("like-button");
    likeButton.textContent = "Like";
    likeButton.addEventListener("click", () => this.onLike());
  
    buttonsContainer.appendChild(dislikeButton);
    buttonsContainer.appendChild(likeButton);
  
    card.appendChild(content);
    card.appendChild(buttonsContainer);
  
    this.cardElement = card;
    return card;
  }  

  onLike() {
    if (this.cardElement && this.onLikeCallback) {
      this.cardElement.style.transition = "transform 0.3s ease";
      this.cardElement.style.transform = "translateX(150%)";
      setTimeout(() => this.cardElement.remove(), 300);
      this.onLikeCallback(this.restaurantData);
    }
  }

  onDislike() {
    if (this.cardElement && this.onDislikeCallback) {
      this.cardElement.style.transition = "transform 0.3s ease";
      this.cardElement.style.transform = "translateX(-150%)";
      setTimeout(() => this.cardElement.remove(), 300);
      this.onDislikeCallback(this.restaurantData);
    }
  }

  addSwipeListeners(onLikeCallback, onDislikeCallback) {
    this.onLikeCallback = onLikeCallback;
    this.onDislikeCallback = onDislikeCallback;
  }
}
