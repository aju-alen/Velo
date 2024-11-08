import express from "express";
const router = express.Router()
import {addUserAddress,addAgentAddress,getSingleUserAddress,addExternalUserAddress} from '../controllers/address-controller.js';



router.post('/create-user-address', addUserAddress);
router.post('/create-agent-address', addAgentAddress);
router.post('/save-external-user-address', addExternalUserAddress);
router.get('/get-user-address/:userId', getSingleUserAddress);


export default router;