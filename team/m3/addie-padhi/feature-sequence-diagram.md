# Home Page and Restaurant Recommendation System

## Description

The Home Page and Restaurant Recommendation System is the feature on the home page where users are recommended restaurants to assess based on their preferences (which they can apply through a filter option). Once a recommendation is presented to the user, they have two options:

- Like the restaurant: Liking a restaurant will save the restaurant to the user's "saved restaurants" (implemented through persistent storage in indexeddb), where users can access them through the saved restaurants dashboard
- Dislike the restaurant: Disliking a restaurant will simply remove the restaurant from their view
After a user likes/dislikes the restaurant, the card stack will automatically display the next card and the user's saved restaurants will dynamically update, if applicable. 

The following work flow shows user interactions with the recommendation system and how the component integrates with the system as a whole, as well as other features.

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User as User
    participant Filter as Filter Component
    participant Recommendation as Recommendation System
    participant IndexedDB as IndexedDB
    participant SavedDashboard as Saved Restaurants Dashboard

    User->>Filter: Apply filters (e.g., cuisine, price, distance)
    Filter->>Recommendation: Pass filter criteria
    Recommendation->>Recommendation: Filter restaurants based on criteria
    Recommendation->>User: Display filtered restaurant recommendation

    User->>Recommendation: Like a restaurant
    Recommendation->>IndexedDB: Save restaurant to savedRestaurants
    IndexedDB-->>Recommendation: Confirm restaurant saved
    Recommendation->>SavedDashboard: Update saved restaurants list
    SavedDashboard-->>User: Reflect changes in Saved Restaurants

    User->>Recommendation: Dislike a restaurant
    Recommendation->>Recommendation: Remove disliked restaurant from stack
    Recommendation->>User: Display next restaurant card

    User->>SavedDashboard: Navigate to Saved Restaurants Dashboard
    SavedDashboard->>IndexedDB: Fetch saved restaurants
    IndexedDB-->>SavedDashboard: Return saved restaurants list
    SavedDashboard->>User: Display saved restaurants

    User->>SavedDashboard: Remove a saved restaurant
    SavedDashboard->>IndexedDB: Delete restaurant from savedRestaurants
    IndexedDB-->>SavedDashboard: Confirm deletion
    SavedDashboard->>User: Update UI to reflect deletion

```
