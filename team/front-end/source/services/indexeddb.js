// // open database
export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('plateful', 1); // open the database with 'restaurantAppDB'

        // Event triggered when the database is created or upgraded
        request.onupgradeneeded = function (event) {
            const db = event.target.result;

            // Create an object store for 'savedRestaurants' if it doesn't exist
            if (!db.objectStoreNames.contains('savedRestaurants')) {
                db.createObjectStore('savedRestaurants', { keyPath: 'id' }); // Use 'id' as the key
            }
        };

        // Handle errors when opening the database
        request.onerror = function () {
            reject('Error opening database');
        };

        // Resolve the database object on success
        request.onsuccess = function (event) {
            resolve(event.target.result);
        };
    });
}

// Retrieves all saved restaurants from the 'savedRestaurants' object store
export function getSavedRestaurants() {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase(); // Open the database
        const transaction = db.transaction(['savedRestaurants'], 'readonly'); // Start a read-only transaction
        const store = transaction.objectStore('savedRestaurants'); // Access the 'savedRestaurants' object store
        const request = store.getAll(); // Retrieve all entries in the store

        // Resolve with the result when the operation is successful
        request.onsuccess = function () {
            resolve(request.result);
        };

        // Reject if there is an error during the fetch
        request.onerror = function () {
            reject('Error fetching saved restaurants');
        };
    });
}

// Saves or updates a restaurant in the 'savedRestaurants' object store
export function saveRestaurant(restaurant) {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase(); // Open the database
        const transaction = db.transaction(['savedRestaurants'], 'readwrite'); // Start a read-write transaction
        const store = transaction.objectStore('savedRestaurants'); // Access the 'savedRestaurants' object store

        // Ensure the restaurant has a valid 'id'
        if (!restaurant.id) {
            reject('Restaurant must have a valid id.');
            return;
        }

        // Check if the restaurant already exists in the store
        const existing = await new Promise((resolve, reject) => {
            const getRequest = store.get(restaurant.id); // Retrieve the restaurant by 'id'
            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        });

        // If the restaurant exists, update it; otherwise, add it as a new entry
        if (existing) {
            Object.assign(existing, restaurant); // Merge the existing and new data
            store.put(existing).onsuccess = () => resolve('Restaurant updated'); // Update the entry
        } else {
            store.add(restaurant).onsuccess = () => resolve('Restaurant saved'); // Add the entry
        }
    });
}

// Removes a restaurant from the 'savedRestaurants' object store by its 'id'
export function removeRestaurant(id) {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase(); // Open the database
        const transaction = db.transaction(['savedRestaurants'], 'readwrite'); // Start a read-write transaction
        const store = transaction.objectStore('savedRestaurants'); // Access the 'savedRestaurants' object store

        const request = store.delete(id); // Delete the restaurant by 'id'

        // Resolve when the deletion is successful
        request.onsuccess = function () {
            resolve('Restaurant removed');
        };

        // Reject if there is an error during the deletion
        request.onerror = function () {
            reject('Error removing restaurant');
        };
    });
}
