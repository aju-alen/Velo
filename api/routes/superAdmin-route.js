import express from "express";
const router = express.Router()
import{createNewCountry,createNewCategory,getAllAppointmentRequest} from '../controllers/superAdmin-route.js';
import { verifyToken } from "../middlewares/jwtVerify.js";


router.post('/create-new-country', createNewCountry);
router.post('/create-new-category', createNewCategory);
router.get('/get-all-appointent-request',verifyToken ,getAllAppointmentRequest);

export default router;