import express from "express";
const router = express.Router()
import {postListing,getListingByCategory,getSingleListing} from '../controllers/listing-controller.js';
import { verifyToken } from "../middlewares/jwtVerify.js";



router.post('/create-listing',verifyToken, postListing);
router.get('/get-listing-by-category/:categoryId', getListingByCategory);
router.get('/get-single-listing/:listingId', getSingleListing);

export default router;