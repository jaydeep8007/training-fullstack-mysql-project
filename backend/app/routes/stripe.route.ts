import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import { createCheckoutSession } from '../controllers/stripe.controller';

router.post('/create-checkout-session', createCheckoutSession);

export default router;