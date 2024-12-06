import express from 'express';
import cors from 'cors';
import { sequelize } from '../model/ModelFactory.js';
import RestaurantRoutes from '../routes/RestaurantRoutes.js';

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