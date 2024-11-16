export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('restaurantAppDB', 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('savedRestaurants')) {
                db.createObjectStore('savedRestaurants', { keyPath: 'id' });
            }
        };

        request.onerror = function () {
            reject('Error opening database');
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };
    });
}

export function getSavedRestaurants() {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction(['savedRestaurants'], 'readonly');
        const store = transaction.objectStore('savedRestaurants');
        const request = store.getAll();

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject('Error fetching saved restaurants');
        };
    });
}

export function saveRestaurant(restaurant) {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction(['savedRestaurants'], 'readwrite');
        const store = transaction.objectStore('savedRestaurants');
        const request = store.put(restaurant);

        request.onsuccess = function () {
            resolve('Restaurant saved');
        };

        request.onerror = function () {
            reject('Error saving restaurant');
        };
    });
}

export function removeRestaurant(id) {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction(['savedRestaurants'], 'readwrite');
        const store = transaction.objectStore('savedRestaurants');
        
        const request = store.delete(id);

        request.onsuccess = function () {
            resolve('Restaurant removed');
        };

        request.onerror = function () {
            reject('Error removing restaurant');
        };
    });
}
