import { rating_system } from "./components/rating_system/rating_system.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app) {
    const ratingSystem = new rating_system();
    app.appendChild(ratingSystem.render());
  } else {
    console.error("App element not found in DOM");
  }
});
