import express from "express";
const router = express.Router()
import { getSingleOrganisationData,signupSubAgent,updatePricing,getPricingData,getAllOrganisationData,getShippingQuotes} from '../controllers/organisation-controller.js';
import { verifyToken } from "../middlewares/jwtVerify.js";



router.post('/signup-sub-agent',verifyToken, signupSubAgent);
router.put('/save-pricing',verifyToken, updatePricing);
router.get('/get-pricing',verifyToken, getPricingData);
router.get('/shipping-quotes',verifyToken, getShippingQuotes);
router.get('/get-all-organisation-data',verifyToken, getAllOrganisationData);
router.get('/get-single-org-data/:agentId',verifyToken, getSingleOrganisationData);

export default router;