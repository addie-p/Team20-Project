// Import dependencies
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const passport = require("./login/src/auth/passport.js");  // Adjust the path as needed
const authRoutes = require("./login/src/routes/authRoutes.js");
const RestaurantRoutes = require("./routes/RestaurantRoutes");
const { sequelize } = require("./model/ModelFactory");

// Configure environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, "../front-end/source")));

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/auth", authRoutes);
app.use("/api", RestaurantRoutes);

// Sync database and start server
sequelize.sync({ force: false })
  .then(() => {
    console.log("Database connected and models synced");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Database connection failed:", err));
