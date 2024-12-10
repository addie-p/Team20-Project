const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("./auth/passport");
const AuthRoutes = require("./routes/UserRoutes");
const { sequelize } = require("./model/ModelFactory");
const RestaurantRoutes = require("./routes/RestaurantRoutes");
const LikedRestaurantRoutes = require("./routes/LikedRestaurantRoutes");
const VisitedRestaurantRoutes = require("./routes/VisitedRestaurantRoutes");

const app = express();
const port = process.env.PORT || 3000;

// CORS Configuration
app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight Request Handler
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Configuration
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

// restrict access to pages
app.use(
  "/",
  (req, res, next) => {
    const protectedPages = ["/index.html", "/dashboard.html", "/brackets.html"];
    if (protectedPages.includes(req.path) && !req.isAuthenticated()) {
      return res.redirect("/login.html");
    }
    next();
  },
  express.static(path.join(__dirname, "../front-end/source"), {
    index: "login.html", 
  })
);

// API Routes
app.use("/api", RestaurantRoutes);
app.use("/api/likedrestaurants", LikedRestaurantRoutes);
app.use("/api/visitedrestaurants", VisitedRestaurantRoutes);
app.use("/auth", AuthRoutes);

// Default Route Redirect
app.get("/", (req, res) => res.redirect("/login.html"));

// Database Sync and Server Start
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected and models synced");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Database connection failed:", err));
