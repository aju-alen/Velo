import express from "express";
const router = express.Router()
import{register,verifyAccountExist} from '../controllers/auth-controller.js';

router.post('/register', register);
router.get('/check-registered-account/:mobileCode/:mobileNumber',verifyAccountExist)


export default router;