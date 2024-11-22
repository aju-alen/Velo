import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export const getKeys = async (req, res, next) => {
    try {
        res.status(200).json({
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export const createPaymentIntent = async (req, res, next) => {
    console.log(req.body, 'req.body');
    
    const { amount,accountId,addressLineOne,addressCity, addressState,addressCountry,addressName} = req.body;
    console.log(amount, typeof (amount), 'amount------');


    try {
        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2020-08-27' }
        );
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'aed',
            customer: customer.id,
            shipping: {
                address: {
                  line1: addressLineOne,
                  city: addressCity,
                  state: addressState,
                  postal_code: '0000',
                  country: 'AE',
                },
                name: addressName // Customer's full name
              },
            metadata: {
              accountId: accountId
              },
        });
        res.status(201).json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        });

    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export const webhook = async (req, res, next) => {
    try {
        const event = req.body;

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('PaymentIntent was successful!');
                

                // Then define and call a method to handle the successful payment intent.
                // handlePaymentIntentSucceeded(paymentIntent);
                break;
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object;
                console.log('Charge Succeeded',chargeSucceeded);
                
                // Then define and call a function to handle the event charge.succeeded
                break;
            // ... handle other event types
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