import express from "express";
const router = express.Router();
import {getKeys,createPaymentIntent,webhook,stripeAccountLink, stripteCreateAccount} from '../controllers/stripe-controller.js'
import { verifyToken } from "../middlewares/jwtVerify.js";
router.get('/get-keys',getKeys)
router.post('/create-payment-intent',createPaymentIntent)
router.post('/webhook',webhook)
router.post('/account_link',stripeAccountLink)
router.post('/account',stripteCreateAccount)


export default router;