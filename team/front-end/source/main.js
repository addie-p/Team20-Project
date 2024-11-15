
import { SavedRestaurantsDashboard } from "./components/SavedRestaurantsDashboard/SavedRestaurantsDashboard.js";
import { PhotoUploadsFeature } from './components/photo_uploads/photo_upload.js';
import { rating_system } from "./components/rating_system/rating_system.js";


const app = document.getElementById('app');

const photo_upload = new PhotoUploadsFeature();
const savedRestaurantsDashboard = new SavedRestaurantsDashboard();

app.appendChild(photo_upload.render());
app.appendChild(savedRestaurantsDashboard.render());

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app) {
    const ratingSystem = new rating_system();
    app.appendChild(ratingSystem.render());
  } else {
    console.error("App element not found in DOM");
  }
});

