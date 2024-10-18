import express from "express";
const router = express.Router()
import{createNewCountry} from '../controllers/superAdmin-route.js';


router.post('/create-new-country', createNewCountry);

export default router;