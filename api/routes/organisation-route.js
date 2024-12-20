import express from "express";
const router = express.Router()
import { getSingleOrganisationData,signupSubAgent,updatePricing,getPricingData,getAllOrganisationData} from '../controllers/organisation-controller.js';
import { verifyToken } from "../middlewares/jwtVerify.js";



router.post('/signup-sub-agent',verifyToken, signupSubAgent);
router.put('/save-pricing',verifyToken, updatePricing);
router.get('/get-pricing',verifyToken, getPricingData);
router.get('/get-all-organisation-data',verifyToken, getAllOrganisationData);
router.get('/get-single-org-data/:agentId',verifyToken, getSingleOrganisationData);

export default router;