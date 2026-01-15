import express from "express";
const router = express.Router()
import{register,verifyAccountExist,bookAgentAppointment,loginAccount,checkMobileNumber,checkEmailExists,changePassword,deleteAccount,forgotPassword,verifyResetPasswordOTP,resetPassword} from '../controllers/auth-controller.js';


router.post('/register', register);
router.post('/book-appointment',bookAgentAppointment);
router.post('/login',loginAccount)
router.post('/change-password', changePassword);
router.post('/delete-account', deleteAccount);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetPasswordOTP);
router.post('/reset-password', resetPassword);
router.get('/check-registered-account/:mobileCode/:mobileNumber',verifyAccountExist)
router.get('/check-mobile-number',checkMobileNumber)
router.get('/check-email',checkEmailExists)


export default router;