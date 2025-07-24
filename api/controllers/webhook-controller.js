import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import { createTransport } from '../utils/emailTransport.js';
import {nanoid} from 'nanoid';
dotenv.config();

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();



const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
export const webhook = async (req, res, next) => {
    try {
      
        // const event = req.body;

        const sig = req.headers['stripe-signature'];

        let event;
      
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('PaymentIntent was successful!');
                
                break;
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object;
                console.log('Charge Succeeded',chargeSucceeded);
                
                // Then define and call a function to handle the event charge.succeeded
                break;
                case 'charge.updated':
                    const chargeUpdated = event.data.object;
                    console.log('Charge Succeeded',chargeUpdated);
                    const updateShipment = await prisma.shipment.update({
                        where: {
                            id: chargeUpdated.metadata.shipmentId
                        },
                        data:{
                            paymentSuccess:chargeUpdated.paid,
                            paymentAmount:chargeUpdated.amount/100,
                            customerId:chargeUpdated.customer,
                            recieptUrl:chargeUpdated.receipt_url,
                            stripeId:chargeUpdated.id,
                            paymentCurrency:chargeUpdated.currency,
                            shipmentId:nanoid(10),
                            shipmentStatus:"ORDER_PLACED",
                        }
                    });
                    console.log(chargeUpdated.metadata.shipmentId , 'chargeUpdated.metadata.shipmentId');
                    
                await prisma.$disconnect();


                    
                    sendSuccessPaymentEmail(chargeUpdated.metadata.email,chargeUpdated.amount/100,chargeUpdated.currency,chargeUpdated.receipt_url);
                    console.log('--After Email----');
                    
                    // Then define and call a function to handle the event charge.succeeded
                    break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        res.json({ received: true });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}
