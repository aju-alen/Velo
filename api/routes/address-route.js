import express from "express";
const router = express.Router()
import {addUserAddress,addAgentAddress} from '../controllers/address-controller.js';



router.post('/create-user-address', addUserAddress);
router.post('/create-agent-address', addAgentAddress);

export default router;