import express from "express";
const router = express.Router()
import{createNewCountry,createNewCategory,getAllAppointmentRequest,approveAgentAppointment,declineAgentAppointment} from '../controllers/superAdmin-route.js';
import { verifyToken, requireSuperAdmin } from "../middlewares/jwtVerify.js";


router.post('/create-new-country', createNewCountry);
router.post('/create-new-category', createNewCategory);
router.get('/get-all-appointent-request', verifyToken, requireSuperAdmin, getAllAppointmentRequest);
router.put('/approve-agent-appointment/:agentId', verifyToken, requireSuperAdmin, approveAgentAppointment);
router.put('/decline-agent-appointment/:agentId', verifyToken, requireSuperAdmin, declineAgentAppointment);

export default router;
