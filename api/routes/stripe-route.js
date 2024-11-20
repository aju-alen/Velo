import express from "express";
const router = express.Router();
import {getKeys,createPaymentIntent,webhook} from '../controllers/stripe-controller.js'

router.get('/get-keys',getKeys)
router.post('/create-payment-intent',createPaymentIntent)
router.post('/webhook',webhook)


export default router;