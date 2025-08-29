import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import { createPaymentIntent } from '../controllers/payment.controller';
import { capturePaypalOrder, createPaypalOrder } from '../controllers/paypal.controller';
import { createStripeSubscription } from '../controllers/payment.controller';
import { getMySubscriptions } from '../controllers/payment.controller';

import {initiatePayUPayment} from '../controllers/payu.controller';
// import { handleStripeWebhook } from '../controllers/webhook.controller';



//stripe
router.post('/stripe/create-stripe-order', createPaymentIntent);
router.post('/stripe/stripe-subscription' , createStripeSubscription)
router.get("/stripe/my-subscription/:customerEmail",  getMySubscriptions);

//paypal 
router.post('/paypal/create-paypal-order', createPaypalOrder);
router.post("/paypal/capture-paypal-order", capturePaypalOrder);

//payu
router.post('/payu/payu-checkout', initiatePayUPayment);





// router.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook); // ✅ Add this

export default router;
