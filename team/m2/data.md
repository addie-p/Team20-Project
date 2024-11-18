# Application Data 

## M3 Update
The general structure of the data is still uniform throughout the application, but for the front-end milestone, many used dummy data with just attributes that were relevant to their features. For example, some features tested on restaurants with a name and price range, while another only needed to test on a name, and others only used names and ratings or locations or images. As we move into back-end, we will ensure that the structure and all attributes are consistent between pages.

### How front-end interacts with IndexedDB
Our front-end first opens IndexedDB to establish the initial connection. The restaurant cards are pulled from IndexedDB, that stores restaurants and their attributes. When information about restaurants are updated, the restaurant will be updated in its IndexedDB database with the new attribute value. For example, a restaurant that is liked will be updated with a true value for the "saved" attribute. When a restaurant is rated, it is updated with the new rating. When a restaurant has a photo uploaded to it, its photo list is updated with the new photo appended.

##  M2 Overview

### 1. Filter
- **Description**: Contains user preferences on their food search to give best restaurant recommendations.
- **Attributes**:
  - `cuisines` (List[string]): List of cuisines the user is craving.
  - `distance` (float): Max distance a restaurant should be from user.
  - `price` (float): A unique identifier for each user.
  - `diet-restrict` (dictionary): Dictionary of key-value pairs for dietary restrictions (key = restriction : boolean)
    - `vegetarian` (boolean): Whether or not the restaurant has vegetarian options.
    - `vegan` (boolean): Whether or not the restaurant has vegan options.
    - `nut_free` (boolean): Whether or not the restaurant has nut free options.
    - `gluten_free` (boolean): Whether or not the restaurant has gluten free options.
- **Data Source**: User-input data when first searching on the site.

### 2. Restaurant Profile
- **Description**: Contains information about a restaurant. Restaurant object.
- **Attributes**:
  - `rest_name` (string): Restaurant name.
  - `photo_link` (string): Link to photo for restaurant.
  - `location` (tuples): Coordinates of restaurant location.
  - `avg_price` (float): Average price of all menu items.
  - `saved` (boolean): Whether or not the restaurant is saved by user.
  - `cuisines` (List[string]): List of cuisines the restaurant serves.
  - `dietary-restrictions` (List[string]): List of dietary restrictions the restaurant is friendly to.
  - `visited_obj` (dictionary): Dictionary containing information after visit.
    - `visited` (boolean): Whether or not the restaurant has been visited.
    - `rating` (integers): Number of stars given to the restaurant.
    - `comment` (string): Notes about the visit.
    - `photos` (List[string]): Links to photos from visiting the restaurant.
- **Data Source**: System-generated based on web APIs.

### 3. Restaurant Lists
- **Description**: Lists of restaurants to remember user's saved and visited restaurants.
- **Attributes**:
  - `saved_list` (List[Restaurants]): List of restaurants that user saved as want to visit.
  - `visited_list` (List[Restaurants]): List of restaurants that user has visited.
- **Data Source**: System-generated based on user input through restaurant browsing and restaurant profiles.

## Data Relationships
- **Lists to Restaurant Profile**: One-to-many relationship (a saved or visited list can contain many restaurant profiles).
- **Filter to Restaurant Profile**: One-to-many relationship (a filter can apply to many restaurant profiles), restaurants filter on filter attributes.
- **Restaurant Profile to Lists**: Restaurant profile variables can be used to validate a restaurant's presence in the visited and saved lists.

## Data Sources
- **User-Input Data**: Data like filter preferences/settings, saving a restaurant, and marking a restaurant as visited comes from direct user input via forms/actions in the application.
- **System-Generated Data**: Restaurant profile data will be filled in based on web APIs and further calculations can done on the data to fully complete the restaurant profile. We will specifically being using geographic location APIs for maps of restaurants and estimating distances. We also found it more accessible to access restaurant data from csv or xml files instead of APIs due to price limitations.
