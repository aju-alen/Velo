import express from "express";
const router = express.Router()
import {getAllCategory} from '../controllers/category-controller.js';

router.get('/get-all-categories',getAllCategory);


export default router;