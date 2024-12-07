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
app.use('/api', RestaurantRoutes);

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
  console.log('Database connected and models synced');
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(err => console.error('Database connection failed:', err));
