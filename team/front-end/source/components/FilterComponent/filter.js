export class FilterComponent {
  constructor(restaurants) {
    this.restaurants = restaurants;
  }

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

    this.displayResults(filteredRestaurants);
  }

  displayResults(filteredRestaurants) {
    const resultsContainer = document.getElementById('results');

    if (filteredRestaurants.length === 0) {
      resultsContainer.innerHTML = `<h2>Results</h2><p>Sorry, no restaurants match your  selected filters.</p>`;
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

  render() {
    const container = document.createElement('div');
    container.classList.add('filter-container');

    container.innerHTML = `
      <h1>Apply filters to customize which restaurants are recommended to you!</h1>
      <form id="filterForm">
        <!-- Cuisine Type -->
        <label for="cuisine">Cuisine Type:</label>
        <select id="cuisine" name="cuisine">
          <option value="">Any</option>
          <option value="Pizza">Pizza</option>
          <option value="Vietnamese">Vietnamese</option>
          <option value="Japanese">Japanese</option>
        </select>

        <!-- Vegetarian Option -->
        <label>Vegetarian:</label>
        <input type="checkbox" id="vegetarian" name="vegetarian">

        <!-- Price -->
        <label for="price">Price Range:</label>
        <select id="price" name="price">
          <option value="">Any</option>
          <option value="$">$</option>
          <option value="$$">$$</option>
          <option value="$$$">$$$</option>
        </select>

        <!-- Distance -->
        <label for="distance">Maximum Distance (in miles):</label>
        <input type="number" id="distance" name="distance" placeholder="ex: 5" min="1">

        <!-- Submit -->
        <button type="button" id="applyFilters">Search</button>
      </form>

      <div id="results">
        <h2>Results</h2>
        <p>No filters applied yet.</p>
      </div>
    `;

    container.querySelector('#applyFilters').addEventListener('click', () => this.applyFilters());

    return container;
  }
}

