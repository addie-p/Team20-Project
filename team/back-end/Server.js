import express from 'express';
import cors from 'cors';
import { sequelize } from '../model/ModelFactory.js';
import RestaurantRoutes from '../routes/RestaurantRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', RestaurantRoutes);

sequelize.sync({ force: false }).then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Database connection failed:', err));
