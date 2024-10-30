import express from "express";
const router = express.Router()
import{createNewCountry,createNewCategory} from '../controllers/superAdmin-route.js';


router.post('/create-new-country', createNewCountry);
router.post('/create-new-category', createNewCategory);

export default router;