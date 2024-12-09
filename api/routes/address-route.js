import express from "express";
const router = express.Router()
import {addUserAddress,addAgentAddress,getSingleUserAddress,addExternalUserAddress,getAllExternalSaveAddress} from '../controllers/address-controller.js';
import { verifyToken } from "../middlewares/jwtVerify.js";



router.post('/create-user-address', addUserAddress);
router.post('/create-agent-address', addAgentAddress);
router.post('/save-external-user-address', addExternalUserAddress);
router.get('/get-user-address/:userId', getSingleUserAddress);
router.get('/get-external-user-address/:userId', getAllExternalSaveAddress);


export default router;