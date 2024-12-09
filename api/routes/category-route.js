import express from "express";
const router = express.Router()
import {getAllCategory} from '../controllers/category-controller.js';
import { verifyToken } from "../middlewares/jwtVerify.js";

router.get('/get-all-categories',getAllCategory);


export default router;