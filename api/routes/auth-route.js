import express from "express";
const router = express.Router()
import{register,verifyAccountExist,bookAgentAppointment,loginAccount,checkMobileNumber,checkEmailExists} from '../controllers/auth-controller.js';

router.post('/register', register);
router.post('/book-appointment',bookAgentAppointment);
router.post('/login',loginAccount)
router.get('/check-registered-account/:mobileCode/:mobileNumber',verifyAccountExist)
router.get('/check-mobile-number',checkMobileNumber)
router.get('/check-email',checkEmailExists)


export default router;