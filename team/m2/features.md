# Application Features

## Recommendation System

The recommendation system in our web application provides personalized dining suggestions tailored for each users’ preferences. The algorithm behind this system curates a dynamic list of restaurant recommendations. Restaraunt cards which display information and a photo for each restaurant are created and then connected to the filtering system, so only filtered restaurant cards are displayed. Users are able to click the checkmark button on the card if they like a restaurant, or the x button if they do not like a restaurant. When the like button is clicked, the restaurant is moved to the saved restaraunts dashboard. When the user clocks the dislike button, the restaurant is removed from the list of recommended options. When the user has gone through all the possible recommendations and liked or disliked them, the feature tells them that there are no more restaurants that match their preferences. This recommendation system is designed to help users choose from a relevant list of restaurants they may be interested in, encouraging exploration while also prioritizing meaningful and decisive interactions.

**Point Value**: 5 points

Subfeatures: 
    - Like/dislike feature
    - Nav bar
    - Homepage
    - Restaurant cards

**Assigned to**: Addie Padhi
  
## Saved Restaurants Dashboard

The saved restaurants dashboard serves as a personalized hub for users to easily access and manage the restaurants that they liked. These liked restaurants will go to the "Want to Try" category in the dashboard. Users can view details about the restaurants they saved such as the average rating and a photo of the restaurant to help them make comprehensive decisions when selecting where to dine. The user can also move the restaurant to the “Visited” category if they decide to go there. The feature then links to the rating and review system feature through a button on the restaraunt card once it is in the "Visited" category. 

**Point Value**: 3 points 

Subfeatures:
    - Want to try/Visited categories
    - Restaurant cards

**Assigned to**: Eva Choudhury

## Filter System

The filters feature allows users to refine their dining options based on specific preferences which are cuisine type, vegetarian or not, distance, and price range ($, $$ and $$$). When a user applies the filters, restaraunt data is fetch from a CSV and the parsed data is then filtered through and resulting restaraunts which fit the user's criteria are displayed. The filter feature then links to the recommendation system feature because only the restaraunt cards of the filtered restaurants are displayed as recommendations that the user can like or dislike. Users can narrow down a vast array of restaurants using the filters, streamlining the search process and only providing relevant recommendations. Users can also dynamically update the filters to adjust to their shifting preferences and to find an optimal restaurant for them.

**Point Value**: 3 points

Subfeatures:
    - Filter form that takes in user input
    - Filter functionality that grabs csv data and returns only filtered restaurants

**Assigned to**: Sandra Vishnu

## Geolocation/Map Feature

The geolocation feature displays restaurants in the user's area based on their current location. The application will request the user to input their location and if the user does give permission, restaurants nearby will be shown to the viewer on a map where they can hover over the markers to see further details about each restaurant. Right now, the map is using the location of Amherst to display nearby restaraunts, but it will further be developed to use the user's location. The restaraunt data is fetched using the Overpass API.

**Point Value**: 3 points

Subfeatures:
    - Fetches restaraunt location data using Overpass API
    - Displays map on homepage with markers for restaurants 

**Assigned to**: Aliya Abedeen

## Rating and Review System

This feature will allow users to give a star rating out of 5 stars once they have visited each restaurant. It will also provide users with a text box where they can write a review or short notes about their experiences and food they had at the restaurant. The feature motivates users to keep using the web application because they are able to keep track of which restaurants and foods they enjoyed and which ones they disliked. This can help them decide whether they want to go back to the restaurant if they are craving the same cuisine in the future. 

**Assigned to**: Jada Tu

## Photo Uploads

This feature will allow users to upload photos of the food they purchased and of the restaurant’s ambience after they have visited and moved the restaurant to the ‘Been To’ category. Adding photo uploads will help users remember each meal they had and whether they liked how the restaurant was set-up. This will also motivate them to return to the app when needing to make decisions about going back to the restaurant.

**Assigned to**: Helen Liu

## Ranking Bracket System

Through this feature, users can participate in head-to-head matchups, where they vote for the restaurants they want to visit the most, as well as restaurants that they have been to, based on personal experiences and ratings. As users progress through the rounds, they narrow down their favorites, creating a personalized ranking of restaurants. The system dynamically updates scores based on their choices and ratings, essentially “gamifying” the decision-making process. This feature will allow users to organize the restaurants that they have saved and rank those that they have been to. 

**Assigned to**: Carol Ding
