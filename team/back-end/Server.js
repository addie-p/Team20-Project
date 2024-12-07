const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./model/ModelFactory');
const RestaurantRoutes = require('./routes/RestaurantRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../front-end/source')));

// API Routes
app.use('/api/restaurants', RestaurantRoutes);

// Catch-all route for serving the frontend
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../front-end/source/index.html'));
});

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
  console.log('Database connected and models synced');
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(err => console.error('Database connection failed:', err));
