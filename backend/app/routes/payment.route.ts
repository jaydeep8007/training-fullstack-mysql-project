import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import { stripeCreateCheckoutSession } from '../controllers/payment.controller';
import { createPaypalOrder } from '../controllers/payment.controller';


router.post('/stripe/create-stripe-order', stripeCreateCheckoutSession);

router.post("/paypal/create-paypal-order", createPaypalOrder);

export default router;