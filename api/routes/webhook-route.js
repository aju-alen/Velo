import express from "express";
const router = express.Router();
import {webhook} from '../controllers/webhook-controller.js'
import { verifyToken } from "../middlewares/jwtVerify.js";

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    webhook
  );
// router.post('/account_link',stripeAccountLink)
// router.post('/account',stripteCreateAccount)


export default router;