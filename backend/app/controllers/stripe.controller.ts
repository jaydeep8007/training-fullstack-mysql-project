import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // items should be an array of { price, quantity }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items,
      success_url: 'http://localhost:5173/payment-success', // your frontend
      cancel_url: 'http://localhost:5173/payment-cancel',
    });

     res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe session error:', error);
    res.status(500).json({ error: error.message || 'Stripe checkout error' });
  }
};
