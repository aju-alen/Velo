import express from "express";
const router = express.Router()
import { getSingleOrganisationData,signupSubAgent } from '../controllers/organisation-controller.js';
import { verifyToken } from "../middlewares/jwtVerify.js";



router.get('/get-single-org-data/:agentId',verifyToken, getSingleOrganisationData);
router.post('/signup-sub-agent',verifyToken, signupSubAgent);

export default router;