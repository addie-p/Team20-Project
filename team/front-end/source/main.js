import { SavedRestaurantsDashboard } from "./components/SavedRestaurantsDashboard/SavedRestaurantsDashboard.js";

const app = document.getElementById("app");
const savedRestaurantsDashboard = new SavedRestaurantsDashboard();
app.appendChild(savedRestaurantsDashboard.render());
