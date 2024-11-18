# Ranking Bracket System Diagram 

## Description

The goal of ranking bracket system is to narrow down tje restaurant options until the most ideal restaurant for the user is chosen. The feature accesses the date in localStorage to use as voting options. It is going to access the restaurants that the user voted yes on from the feature recommendation system. Each restaurant that is voted "yes" on will be used in this voting system. There are vote options for each restaurant option. On each restaurant card there's a button to vote, the name of the restaurant and the description of the restaurant with how expensive it is and the type of cuisine. When the user clicks the vote button for a restaurant, the system registers the vote, updates the current pair to show the next two restaurants, and notifies the user of their vote. The restaurant that is voted for will stay and the other restaurant option will switch. The last restaurant that is voted for will be the most perfect restaurant for the user. 


## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant RankingBracketSystem
    participant LocalStorage

    User->>Browser: User loads the page
    Browser->>RankingBracketSystem: Initialize RankingBracketSystem
    RankingBracketSystem->>LocalStorage: Retrieves savedRestaurants from localStorage
    LocalStorage-->>RankingBracketSystem: Returns savedRestaurants data
    RankingBracketSystem->>RankingBracketSystem: Formats and sets up restaurants array
    RankingBracketSystem->>Browser: Loads initial UI with restaurant options

    User->>Browser: User clicks on "Vote for [restaurant]" button
    Browser->>RankingBracketSystem: Calls voteForRestaurant(restaurant) method
    RankingBracketSystem->>RankingBracketSystem: Records the user's vote and increases vote count for the selected restaurant
    RankingBracketSystem->>RankingBracketSystem: Calls updateToNextPair(votedRestaurantName)
    RankingBracketSystem->>RankingBracketSystem: Finds the next restaurant and updates #currentPair
    alt Next restaurant exists
        RankingBracketSystem->>Browser: Re-renders container with updated restaurant pair
    else No more restaurants
        RankingBracketSystem->>Browser: Calls showBestRestaurant()
        Browser->>User: Shows "The best restaurant for you is [restaurantName]!"
    end

```
