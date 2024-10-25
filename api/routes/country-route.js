import express from "express";
const router = express.Router()
import {getAllCountry} from '../controllers/country-controller.js';



router.get('/get-all-countries', getAllCountry);

export default router;