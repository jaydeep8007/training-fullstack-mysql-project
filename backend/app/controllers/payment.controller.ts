import { Request, Response } from 'express';
import Stripe from 'stripe';
import paypal from "@paypal/checkout-server-sdk";
import paypalClient from '../utils/utils.paypalClients';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2023-10-16',
});

export const stripeCreateCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // items should be an array of { price, quantity }
    console.log("stripe" , stripe)
    console.log("stripe" , stripe.checkout)
    console.log("stripe" , stripe.checkout.sessions)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card',"alipay"],
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




// Example Express handler
export const createPaypalOrder = async (req, res) => {
  const { amount, currency } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency || "USD",
          value: amount.toString(),
        },
      },
    ],
    application_context: {
      brand_name: "Your Brand",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
    },
  });

  try {
    const order = await paypalClient.execute(request);
    const approvalUrl = order.result.links.find((link) => link.rel === "approve")?.href;

    res.status(200).json({
      id: order.result.id,
      url: approvalUrl,
    });
  } catch (err) {
    console.error("PayPal Order Error", err);
    res.status(500).json({ error: "PayPal order creation failed" });
  }
};
