export class FilterComponent { //exports FilterComponent class
  constructor(restaurants) {
    this.restaurants = restaurants; //restaraunts from main.js
    this.loadCSS();
  }

 //function that applies filters chosen by the user by checking whether each restaurant matches their preferences
  applyFilters() {
    const cuisine = document.getElementById('cuisine').value;
    const vegetarian = document.getElementById('vegetarian').checked;
    const price = document.getElementById('price').value;
    const distance = document.getElementById('distance').value;

    let filteredRestaurants = [...this.restaurants];

    if (cuisine) {
      filteredRestaurants = filteredRestaurants.filter(r => r.cuisine === cuisine);
    }
    if (vegetarian) {
      filteredRestaurants = filteredRestaurants.filter(r => r.vegetarian);
    }
    if (price) {
      filteredRestaurants = filteredRestaurants.filter(r => r.price === price);
    }
    if (distance) {
      filteredRestaurants = filteredRestaurants.filter(r => r.distance <= Number(distance));
    }

//display the restaraunts that match the filters chosen by the user or a message saying no restaurants match those selected filters
    this.displayResults(filteredRestaurants);
  }

  displayResults(filteredRestaurants) {
    const resultsContainer = document.getElementById('results');

    if (filteredRestaurants.length === 0) {
      resultsContainer.innerHTML = `<h2>Results</h2><p>Sorry, no restaurants match your selected filters.</p>`;
    } else {
      resultsContainer.innerHTML = `
        <h2>Results</h2>
        <ul>
          ${filteredRestaurants
            .map(
              r =>
                `<li>${r.name} - ${r.cuisine}, ${r.price}, ${r.distance} miles away</li>`
            )
            .join('')}
        </ul>
      `;
    }
  }

  loadCSS(){
    const style = document.createElement("link");
    style.rel="stylesheet";
    style.href= "components/FilterComponent/filter.css"
    document.head.appendChild(style)
  }

//render html UI in the js file
  render() {
    const container = document.createElement('div');
    container.classList.add('filter-container');

    container.innerHTML = `
      <h1>Filter Your Restaraunt Recommendations</h1>
      <h2>Plateful can help you choose the perfect restaraunt for you!</h2>
      <form id="filterForm">
        
        <label for="cuisine">Cuisine Type:</label>
        <select id="cuisine" name="cuisine">
          <option value="">Any</option>
          <option value="Pizza">Pizza</option>
          <option value="Vietnamese">Vietnamese</option>
          <option value="Japanese">Japanese</option>
        </select>

        
        <label>Vegetarian:</label>
        <input type="checkbox" id="vegetarian" name="vegetarian">

       
        <label for="price">Price Range:</label>
        <select id="price" name="price">
          <option value="">Any</option>
          <option value="$">$</option>
          <option value="$$">$$</option>
          <option value="$$$">$$$</option>
        </select>

        
        <label for="distance">Maximum Distance (in miles):</label>
        <input type="number" id="distance" name="distance" placeholder="ex: 5" min="1">

        
        <button type="button" id="applyFilters">Search</button>
      </form>

      <div id="results">
        <h2>Results</h2>
        <p>No filters applied yet.</p>
      </div>
    `;

  //adds event listener to the search button
    container.querySelector('#applyFilters').addEventListener('click', () => this.applyFilters());

    return container;
  }
}

