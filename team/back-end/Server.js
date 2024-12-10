const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("./auth/passport");
const AuthRoutes = require("./routes/UserRoutes");
const { sequelize, models } = require("./model/ModelFactory");
const RestaurantRoutes = require("./routes/RestaurantRoutes");
const LikedRestaurantRoutes = require("./routes/LikedRestaurantRoutes");
const VisitedRestaurantRoutes = require("./routes/VisitedRestaurantRoutes");


const app = express();
const port = process.env.PORT || 3000;


const resetLikedRestaurants = async () => {
 try {
   await models.Restaurant.update(
     { liked: 0 },
     { where: {} }
   );
   console.log("Reset all liked values to 0.");
 } catch (error) {
   console.error("Error resetting liked values:", error);
 }
};




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
app.use("/auth", AuthRoutes); // Login and authentication routes

// photo upload endpoints
const upload = multer({
  storage: multer.memoryStorage(), // store file in memory for easy access
});

// upload an image with post method to endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const { originalname, buffer } = req.file; // image file field 
  const { restaurant_name } = req.body; // restaurant name text field

  // check if restaurant name is found
  if (!restaurant_name) {
    return res.status(400).send('Restaurant name is required.');
  }

  const sql = `INSERT INTO images (name, data, restaurant_name) VALUES (?, ?, ?)`;
  db.run(sql, [originalname, buffer, restaurant_name], function (err) {
    if (err) {
      console.error('Error inserting image:', err.message);
      return res.status(500).send('Failed to upload image.');
    }
    res.status(201).send({ id: this.lastID, name: originalname, restaurant_name });
  });
});

// retrieve an image by restaurant name
app.get('/image/:restaurant_name', (req, res) => {
  const { restaurant_name } = req.params;

  const sql = `SELECT name, data FROM images WHERE restaurant_name = ?`;
  db.get(sql, [restaurant_name], (err, row) => {
    if (err) {
      console.error('Error retrieving image:', err.message);
      return res.status(500).send('Failed to retrieve image.');
    }

    if (!row) {
      return res.status(404).send('No image found for the specified restaurant.');
    }

    // set content headers for image
    res.setHeader('Content-Disposition', `inline; filename="${row.name}"`);
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(row.data); // send binary image data
  });
});


// Default Route Redirect
app.get("/", (req, res) => res.redirect("/login.html"));


// Database Sync and Server Start
  
sequelize
 .sync({ force: false })
 .then(async() => {
   console.log("Database connected and models synced");
   await resetLikedRestaurants();
   app.listen(port, () => {
     console.log(`Server running at http://localhost:${port}`);
   });
 })
 .catch((err) => console.error("Database connection failed:", err));