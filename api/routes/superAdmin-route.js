import express from "express";
const router = express.Router()
import{createNewCountry,createNewCategory,getAllAppointmentRequest,approveAgentAppointment} from '../controllers/superAdmin-route.js';
import { verifyToken } from "../middlewares/jwtVerify.js";


router.post('/create-new-country', createNewCountry);
router.post('/create-new-category', createNewCategory);
router.get('/get-all-appointent-request',verifyToken ,getAllAppointmentRequest);
router.put('/approve-agent-appointment/:agentId',verifyToken ,approveAgentAppointment);

export default router;