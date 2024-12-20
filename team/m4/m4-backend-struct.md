# Backend Structure
The backend structure follows a modular design, as specified in class, where different components work together to handle requests, manage data, and serve the frontend. The Server.js file acts as the central hub that initializes the Express.js server, sets up middleware, and connects the necessary routes, which define API endpoints. The "controller" folder contains the core logic for handling requests, such as querying the database and performing CRUD operations. The "model" folder, defined using Sequelize, sets up the structure of database tables and enables easy data management. Authentication utilizes Passport.js to allow secure login and session handling. Each component is separated into its own file for scalability and maintainability and is integrated on the frontend with key features like user accounts, restaurant management, and recommendations.

The following file structure was implemented for the backend and server-side integration for milestone 4:

```html
back-end/
├── auth/
│   ├── middleware.js
│   ├── passport.js
├── controller/
│   ├── LikedRestaurantController.js
│   ├── RestaurantController.js
│   ├── UserController.js
│   ├── VisitedRestaurantController.js
├── model/
│   ├── LikedRestaurantModel.js
│   ├── ModelFactory.js
│   ├── RestaurantModel.js
│   ├── UserModel.js
│   ├── VisitedRestaurantModel.js
├── photo_uploads/
│   ├── photo_db_test.js
│   ├── photo_server_test.js
├── routes/
│   ├── LikedRestaurantRoutes.js
│   ├── RestaurantRoutes.js
│   ├── UserRoutes.js
│   ├── VisitedRestaurantRoutes.js
├── scripts/
│   ├── database.sqlite
│   ├── importRestaurants.js
├── source/
├── Server.js
├── testRestaurants.js
```

However, changes were also made to frontend files in order to connect to the backend for requests such as GET and POST requests to retrieve and update information in the database. For comprehensive details about the frontend changes that were made, please refer to the Issues and/or specific Commits.

