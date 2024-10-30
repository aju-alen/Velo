import express from "express";
const router = express.Router()
import {postListing,getListingByCategory} from '../controllers/listing-controller.js';



router.post('/create-listing', postListing);
router.get('/get-listing-by-category/:categoryId', getListingByCategory);

export default router;