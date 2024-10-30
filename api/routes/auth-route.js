import express from "express";
const router = express.Router()
import{register,verifyAccountExist,bookAgentAppointment,loginAccount} from '../controllers/auth-controller.js';

router.post('/register', register);
router.post('/book-appointment',bookAgentAppointment);
router.post('/login',loginAccount)
router.get('/check-registered-account/:mobileCode/:mobileNumber',verifyAccountExist)


export default router;