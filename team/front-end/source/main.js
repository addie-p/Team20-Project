import { FilterComponent } from './components/FilterComponent/filter.js';

const restaurants = [
    { name: "Antonio's Pizza", cuisine: "Pizza", price: "$", vegetarian: true, distance: 2 },
    { name: "Miss Saigon", cuisine: "Vietnamese", price: "$$", vegetarian: true, distance: 4 },
    { name: "Arigato", cuisine: "Japanese", price: "$$", vegetarian: true, distance: 6 },
];


document.documentElement.innerHTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Filter Restaurant Recommendations</title>
    <link rel="stylesheet" href="./components/FilterComponent/filter.css">
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;


const app = document.getElementById('app');
const filterComponent = new FilterComponent(restaurants);
app.appendChild(filterComponent.render());
