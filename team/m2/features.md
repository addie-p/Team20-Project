# Application Features
NOTE: description of subfeatures are included within the feature description (to clearly convey the user processes in a chronological order).

## Recommendation System

The recommendation system in our web application provides personalized dining suggestions tailored for each users’ preferences. The algorithm behind this system curates a dynamic list of restaurant recommendations. restaurant cards which display information and a photo for each restaurant are created and then connected to the filtering system, so only filtered restaurant cards are displayed. Users are able to click the checkmark button on the card if they like a restaurant, or the x button if they do not like a restaurant. When the like button is clicked, the restaurant is moved to the saved restaurants dashboard. When the user clicks the dislike button, the restaurant is removed from the list of recommended options. When the user has gone through all the possible recommendations and liked or disliked them, the feature tells them that there are no more restaurants that match their preferences. This recommendation system is designed to help users choose from a relevant list of restaurants they may be interested in, encouraging exploration while also prioritizing meaningful and decisive interactions.

**Total Point Value**: 9 points 

Subfeatures:
- Like/dislike feature (4 points)
- Navigation bar (2 points)
- Homepage
- Restaurant cards (3 points)

**Assigned to**: Addie Padhi
  
## Saved Restaurants Dashboard

The saved restaurants dashboard serves as a personalized hub for users to easily access and manage the restaurants that they liked. These liked restaurants will go to the "Want to Try" category in the dashboard. Users can view details about the restaurants they saved such as the average rating and a photo of the restaurant to help them make comprehensive decisions when selecting where to dine. The user can also move the restaurant to the “Visited” category if they decide to go there. The feature then links to the rating and review system feature through a button on the restaurant card once it is in the "Visited" category. 

**Total Point Value**: 9 points 

Subfeatures:
- Want to try/Visited categories (3 points)
- Restaurant cards (3 points)
- Dynamic integration with saved restaurants (3 points)

**Assigned to**: Eva Choudhury

## Filter System

The filters feature allows users to refine their dining options based on specific preferences which are cuisine type, vegetarian or not, distance, and price range ($, $$ and $$$). When a user applies the filters, restaurant data is fetch from a CSV and the parsed data is then filtered through and resulting restaurants which fit the user's criteria are displayed. The filter feature then links to the recommendation system feature because only the restaurant cards of the filtered restaurants are displayed as recommendations that the user can like or dislike. Users can narrow down a vast array of restaurants using the filters, streamlining the search process and only providing relevant recommendations. Users can also dynamically update the filters to adjust to their shifting preferences and to find an optimal restaurant for them.

**Total Point Value**: 9 points

Subfeatures:
- Filter form that takes in user input (2 points)
- Filter functionality that grabs csv data and returns only filtered restaurants (4 points)
- Filter integration with indexeddb and saved restaurants feature (3 points)

**Assigned to**: Sandra Vishnu

## Geolocation/Map Feature

The geolocation feature displays restaurants in the user's area based on their current location. The application will request the user to input their location and if the user does give permission, restaurants nearby will be shown to the viewer on a map where they can hover over the markers to see further details about each restaurant. Right now, the map is using the location of Amherst to display nearby restaurants, but it will further be developed to use the user's location. The restaurant data is fetched using the Overpass API. For future updates, we plan to dynamically update the map to display the restaurant that is currently being displayed on the card next to it.

**Point Value**: 9 points

Subfeatures:
- Fetches restaurant location data using Overpass API (3 points)
- Displays map on homepage (3 points)
- Adds markers for restaurants on homepage with cuisine descriptions (3 points)

**Assigned to**: Aliya Abedeen

## Rating and Review System

This feature will allow users to give a star rating out of 5 stars once they have visited each restaurant. It will also provide users with a text box where they can write a review or short notes about their experiences and food they had at the restaurant. The feature motivates users to keep using the web application because they are able to keep track of which restaurants and foods they enjoyed and which ones they disliked. This can help them decide whether they want to go back to the restaurant if they are craving the same cuisine in the future. The reviews that a user makes for a restaurant are dynamically updated in indexeddb, where, for future updates, we plan to display the reviews under the saved restaurants section.

**Point Value**: 9 points

Subfeatures:
- Add review feature to allow users to give description of feedback of restaurant after visiting (3 points)
- Add star feature to allow users to rate restaurant out of five stars (2 points)
- Dynamically integration to update reviews for given restaurant to indexeddb for persistent storage (4 points)
    

**Assigned to**: Jada Tu

## Photo Uploads

This feature will allow users to upload photos of the food they purchased and of the restaurant’s ambience after they have visited and moved the restaurant to the ‘Been To’ category. Adding photo uploads will help users remember each meal they had and whether they liked how the restaurant was set-up. This will also motivate them to return to the app when needing to make decisions about going back to the restaurant. The photos that users upload are dynamically updated in indexeddb and will be available to view under the saved restaurants in future updates. 

**Point Value**: 9 points

Subfeatures:
- Add back, clear, and submit buttons to photo upload page (2 points)
- Add function to submit and make back button go back to rating system page (3 points)
- Make photo file + restaurant persistent in indexeddb/load on refresh (4 points)
    
**Assigned to**: Helen Liu

## Ranking Bracket System

Through this feature, users can participate in head-to-head matchups, where they vote for the restaurants they want to visit the most, as well as restaurants that they have been to, based on personal experiences and ratings. As users progress through the rounds, they narrow down their favorites, creating a personalized ranking of restaurants. The system dynamically updates scores based on their choices and ratings, essentially “gamifying” the decision-making process. This feature will allow users to organize the restaurants that they have saved and rank those that they have been to. The user has the option to vote between two restaurants at a time in order to systematically eliminate restaurants that they do not choose and end up with a "victor" that can help them choose between the restaurants they save.

**Point Value**: 9 points

Subfeatures:
- Dynamically populate brackets based on saved restaurants from indexeddb (3 points) 
- Add "vote" buttons to allow users to vote between two restaurants (1 point)
- Update brackets with choices as user votes (3 points)
- Add notification on browser informing user of what they voted for and the winner (2 points)

**Assigned to**: Carol Ding
