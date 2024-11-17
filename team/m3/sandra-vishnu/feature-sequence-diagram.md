## Feature Description
The filter system feature allows the user to filter the resaurant recommendations they receive on the homepage of the app based on their preferences. The criteria they are able to input on the filter form are cuisine (drop-down list), whether or not there are vegetarian (checkbox), the price point (drop-down list), and the maximum distance from their location they would want their restaraunt to be  (currently the distance for each restaurant has a placeholder in the csv file we are using to pull restaraunt data from, we hope to eventually connect this to the geolocation feature). The user then presses the apply filters button, the restaurant data is fetched fromn the CSV, and the parsed restaraunt data is filtered using the criteria. The filtered list of restaurants is returned and only those restaurant cards are displayed by the recommendation system. If the user changes their preferences on the filter form, the filter is re-applied to the remaining restaraunt data and the processes happens again to display the updated filtered restaurant cards.

## Sequence Diagram
``` mermaid
sequenceDiagram
    participant User
    participant FilterForm
    participant App
    participant RestaurantContainer
    participant CSVService

    User->>FilterForm: Access filter form on application's homepage
    FilterForm-->>App: Render filter UI on page
    
    User->>FilterForm: Apply filters with selected preferences (cuisine, vegetarian, price, distance)
    FilterForm->>RestaurantContainer: Trigger process of rendering filtered restaurants 
    RestaurantContainer->>CSVService: Fetch restaurant data from CSV
    CSVService-->>RestaurantContainer: Pass parsed restaurant data
    RestaurantContainer->>FilterForm: Apply filters to parsed restaurant data
    FilterForm-->>RestaurantContainer: Return filtered list of restaurants
    RestaurantContainer-->>App: Display only filtered restaurant cards as recommendations

    User->>FilterForm: Change filter preferences
    FilterForm->>RestaurantContainer: Clear and re-apply filters
    RestaurantContainer->>FilterForm: Re-apply filters to remaining restaurant data
    FilterForm-->>RestaurantContainer: Return updated filtered list
    RestaurantContainer-->>App: Display updated filtered restaurant cards
```
