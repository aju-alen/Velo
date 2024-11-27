import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth-route.js';
import s3Routes from './routes/s3-route.js';
import superAdminPrivilageRoutes from './routes/superAdmin-route.js';
import countryRoutes from './routes/country-route.js';
import addressRoutes from './routes/address-route.js';
import categoryRoutes from './routes/category-route.js';
import listingRoutes from './routes/listing-route.js';
import stripeRoutes from './routes/stripe-route.js';
import riseRoutes from './routes/rise-route.js';

const app = express();
app.use(cors({
    origin: [
        "exp://10.65.4.65:8081",
        "http://localhost:8081",
        "http://localhost:19000",
        "http://10.65.4.65:19006",
        "http://localhost:5173/",

    ],
})); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/test-routes',superAdminPrivilageRoutes);

app.use('/api/auth',authRoutes);
app.use('/api/s3',s3Routes);
app.use('/api/country',countryRoutes);
app.use('/api/address',addressRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/listing',listingRoutes);
app.use('/api/stripe',stripeRoutes);

app.use('/api/rise',riseRoutes)

app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});