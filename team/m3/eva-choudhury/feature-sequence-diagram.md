# Saved Restaurants Diagram

## Description

The Saved Restaurants feature is the feature where users can view and manage their saved restaurants. Restaurants are categorized into two categories:

- Want to Try: The restaurants the user has liked in the recommendation system but not marked as visited
- Visited: The restaurants the user has marked as visited

The work flow goes through the interactions between the user and the dashboard. This includes viewing saved restaurants, removing them, choosing to review a visited restaurant, and moving restaurants between categories.

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
