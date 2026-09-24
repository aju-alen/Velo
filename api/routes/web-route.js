import express from 'express';
import { webOnly } from '../middlewares/webOnly.js';
import {
  getWebMarketplaceCategories,
  getWebMarketplaceListings,
} from '../controllers/web-marketplace-controller.js';

const router = express.Router();

router.get('/marketplace/categories', webOnly, getWebMarketplaceCategories);
router.get('/marketplace/listings', webOnly, getWebMarketplaceListings);

export default router;
