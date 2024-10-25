import express from "express";
const router = express.Router()
import{register,verifyAccountExist,bookAgentAppointment} from '../controllers/auth-controller.js';

router.post('/register', register);
router.get('/check-registered-account/:mobileCode/:mobileNumber',verifyAccountExist)
router.post('/book-appointment',bookAgentAppointment);


export default router;