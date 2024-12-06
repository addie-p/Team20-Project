const express = require('express');
const cors = require('cors');
//const { sequelize, models } = require('./model/ModelFactory');
const sequelize = require('./model/ModelFactory').sequelize;
const RestaurantRoutes = require('./routes/RestaurantRoutes');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', RestaurantRoutes);

sequelize.sync({ force: false }).then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }).catch((err) => console.error('Database connection failed:', err));