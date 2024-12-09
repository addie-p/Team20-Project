const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("./auth/passport"); // Assuming you have a passport.js file for authentication
const AuthRoutes = require("./routes/UserRoutes"); // Assuming you have auth routes defined
const { sequelize } = require("./model/ModelFactory");
const RestaurantRoutes = require("./routes/RestaurantRoutes");
const LikedRestaurantRoutes = require("./routes/LikedRestaurantRoutes");
const VisitedRestaurantRoutes = require("./routes/VisitedRestaurantRoutes");


const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(
 cors({
   origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
   allowedHeaders: ["Content-Type", "Authorization"],
   credentials: true,
 })
);


// Handle Preflight Requests
app.options("*", (req, res) => {
 res.header("Access-Control-Allow-Origin", req.headers.origin);
 res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
 res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
 res.header("Access-Control-Allow-Credentials", "true");
 res.sendStatus(200);
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Session middleware for login sessions
app.use(
 session({
   secret: process.env.SESSION_SECRET || "defaultSecret",
   resave: false,
   saveUninitialized: false,
 })
);


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Serve static files
app.use(express.static(path.join(__dirname, "../front-end/source")));


// API Routes
app.use("/api", RestaurantRoutes);
app.use("/api/likedrestaurants", LikedRestaurantRoutes);
app.use("/api/visitedrestaurants", VisitedRestaurantRoutes);
app.use("/auth", AuthRoutes); // Login and authentication routes


// Sync database and start server
sequelize
 .sync({ force: false })
 .then(() => {
   console.log("Database connected and models synced");
   app.listen(port, () => {
     console.log(`Server running at http://localhost:${port}`);
   });
 })
 .catch((err) => console.error("Database connection failed:", err));