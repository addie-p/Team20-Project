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
    participant Dashboard as Saved Restaurants component
    participant IndexedDB as IndexedDB
    participant Review as Review System

    User->>Dashboard: Open Saved restaurants Page
    Dashboard->>IndexedDB: Fetch saved restaurants from data from Recommendation system (previous page)
    IndexedDB-->>Dashboard: Return list of saved restaurants
    Dashboard->>User: Display restaurants in Want to Try and Visited sections based on previous choices

    User->>Dashboard: Click Remove on a restaurant
    Dashboard->>IndexedDB: Delete restaurant from storage
    IndexedDB-->>Dashboard: Confirm deletion
    Dashboard->>User: Remove restaurant from UI

    User->>Dashboard: Click plus for a restaurant in Want To Try section
    Dashboard->>IndexedDB: Update restaurant category to Visited
    Dashboard->>User: Move restaurant to Visited section

    User->>Dashboard: Click review link for a restaurant in Visited section
    Dashboard->>Review: Send users to the review system for the restaurant
```
