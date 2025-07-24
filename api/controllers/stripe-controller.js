import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import { createTransport } from '../utils/emailTransport.js';
import {nanoid} from 'nanoid';
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
    
    const { amount,accountId,addressLineOne,addressCity, addressState,addressName,shipmentId,email} = req.body;
    console.log(Number(amount), typeof (Number(amount)), 'amount------');


    try {
        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2020-08-27' }
        );
        const paymentIntent = await stripe.paymentIntents.create({
            // amount: (amount).toFixed(2),
            amount: (Number(amount) * 100).toFixed(0),
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
              accountId: accountId,
              shipmentId: shipmentId,
                email: email
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

const endpointSecret = "whsec_a219c2c88dd666be1bd77588164a2c3bf950a75876b8c1c6abbe09792b6c7069";
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

export const stripeAccountLink = async (req, res, next) => {
    try {
        const { account } = req.body;
    
        const accountLink = await stripe.accountLinks.create({
          account: account,
          return_url: `${req.headers.origin}/return/${account}`,
          refresh_url: `${req.headers.origin}/refresh/${account}`,
          type: "account_onboarding",
        });
    
        res.json(accountLink);
      } catch (error) {
        console.error(
          "An error occurred when calling the Stripe API to create an account link:",
          error
        );
        res.status(500);
        res.send({ error: error.message });
      }
}

export const stripteCreateAccount = async (req, res, next) => {
    try {
        const account = await stripe.accounts.create({
            country: 'AE',
  email: 'jenny.rosen@example.com',
  controller: {
    fees: {
      payer: 'account',
    },
    losses: {
      payments: 'stripe',
    },
    stripe_dashboard: {
      type: 'full',
    },
  },
        });
    
        res.json({
          account: account.id,
        });
      } catch (error) {
        console.error(
          "An error occurred when calling the Stripe API to create an account",
          error
        );
        res.status(500);
        res.send({ error: error.message });
      }
}

//Success Payment Email function.

const sendSuccessPaymentEmail = async (email,price,currency,url) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Payment Success',
        text: `
        Hi there,

        Your payment of ${currency}${price} has been successfully processed.
        Please find the reciept below.
        ${url}

        Thank you for using our service.
        `}
    //send the mail
    try {
        const sendEmailToAdmin = await createTransport.sendMail(mailOptions);
    }
    catch (err) {
        console.log("Err sending verification email", err);
    }
}
