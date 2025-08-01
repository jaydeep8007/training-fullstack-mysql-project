import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import { createPaymentIntent } from '../controllers/payment.controller';
import { createPaypalOrder } from '../controllers/payment.controller';
import { createStripeSubscription } from '../controllers/payment.controller';
// import { handleStripeWebhook } from '../controllers/webhook.controller';

router.post('/stripe/create-stripe-order', createPaymentIntent);
router.post('/paypal/create-paypal-order', createPaypalOrder);

router.post('/stripe/stripe-subscription' , createStripeSubscription)


// router.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook); // ✅ Add this

export default router;
