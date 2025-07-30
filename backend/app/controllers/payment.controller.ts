

import paypal from "@paypal/checkout-server-sdk";
import paypalClient from '../utils/utils.paypalClients';

// src/controllers/paymentController.ts
import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, currency = "usd", cus_email } = req.body;

    if (!amount || isNaN(amount)) {
      return responseHandler.error(res, "Invalid amount", resCode.BAD_REQUEST);
    }

        if (!cus_email) {
      return responseHandler.error(res, "Customer email is required", resCode.BAD_REQUEST);
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
       metadata: {
        cus_email, // now dynamic
      },
      // payment_method_types: ['card', 'alipay'], 
     automatic_payment_methods: { enabled: true },
    });

    return responseHandler.success(
      res,
      "Payment intent created successfully",
      { clientSecret: paymentIntent.client_secret }
    );
  } catch (error) {
    console.error("Stripe Error:", error);
    return responseHandler.error(res, "Payment Intent creation failed", resCode.SERVER_ERROR);
  }
};



// Map your product plan and billing interval to Stripe Price IDs
const priceMap: Record<string, Record<string, string>> = {
  basic: {
    monthly: "price_basic_monthly_id",
    yearly: "price_basic_yearly_id",
  },
  pro: {
    monthly: "price_pro_monthly_id",
    yearly: "price_pro_yearly_id",
  },
  premium: {
    monthly: "price_premium_monthly_id",
    yearly: "price_premium_yearly_id",
  },
};

import axios from "axios";

export const createPayPalSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { planType } = req.body;

    // Example plan IDs mapped to your PayPal plans
    const planMap: Record<string, string> = {
      basic: "P-5SU98575AF676020PNCEJEAI",
      pro: "P-XXXXXXXXXXXXXXX",
      premium: "P-YYYYYYYYYYYYYYY",
    };

    const planId = planMap[planType];
    if (!planId) {
       res.status(400).json({ message: "Invalid plan type" });
    }

    // Step 1: Get access token
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64");
    const tokenResponse = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Step 2: Create subscription
    const subscriptionResponse = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/billing/subscriptions",
      {
        plan_id: planId,
        application_context: {
          brand_name: "Your SaaS App",
          user_action: "SUBSCRIBE_NOW",
          return_url: "http://localhost:5173/payment-success",
          cancel_url: "http://localhost:5173/payment-cancel",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Step 3: Get the approval link and redirect user
    const approvalLink = subscriptionResponse.data.links.find(
      (link: any) => link.rel === "approve"
    );

    if (!approvalLink) {
       res.status(500).json({ message: "Approval link not found" });
    }

     res.status(200).json({
      message: "PayPal subscription created",
      url: approvalLink.href,
    });
  } catch (err) {
    console.error("PayPal Subscription Error:", err);
     res.status(500).json({ message: "PayPal subscription failed" });
  }
};





// export const subscribeCustomer = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { email, paymentMethodId, plan, interval } = req.body;

//     if (!email || !paymentMethodId || !plan || !interval) {
//       return responseHandler.error(res, "All fields are required", resCode.BAD_REQUEST);
//     }

//     const priceId = priceMap[plan]?.[interval];
//     if (!priceId) {
//       return responseHandler.error(res, "Invalid plan or interval", resCode.BAD_REQUEST);
//     }

//     // 1. Create customer
//     const customer = await stripe.customers.create({
//       email,
//       payment_method: paymentMethodId,
//       invoice_settings: {
//         default_payment_method: paymentMethodId,
//       },
//     });

//     // 2. Create subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: customer.id,
//       items: [{ price: priceId }],
//       payment_settings: {
//         payment_method_options: {
//           card: {
//             request_three_d_secure: "automatic",
//           },
//         },
//         payment_method_types: ["card"],
//         save_default_payment_method: "on_subscription",
//       },
//       expand: ["latest_invoice.payment_intent"],
//     });

//     // 3. Return subscription info
//     return responseHandler.success(res, 
//       "Subscription created successfully",
//       {
//       subscriptionId: subscription.id,
//       clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
//       status: subscription.status,
//     });
//   } catch (error: any) {
//     console.error("Stripe subscription error:", error.message);
//     return responseHandler.error(
//       res,
//       error?.message || "Subscription failed",
//       resCode.SERVER_ERROR
//     );
//   }
// };



// export const createSubscription = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { customerEmail, priceId } = req.body;

//     if (!customerEmail || !priceId) {
//       return responseHandler.error(res, "Email and Price ID are required", resCode.BAD_REQUEST);
//     }

//     // Create customer
//     const customer = await stripe.customers.create({
//       email: customerEmail,
//     });

//     // Create subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: customer.id,
//       items: [{ price: priceId }],
//       payment_behavior: 'default_incomplete',
//       expand: ['latest_invoice.payment_intent'],
//     });

//     const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;

//     return responseHandler.success(res, "Subscription created", {
//       subscriptionId: subscription.id,
//       clientSecret,
//     });
//   } catch (error) {
//     console.error("Subscription error:", error);
//     return responseHandler.error(res, "Subscription creation failed", resCode.SERVER_ERROR);
//   }
// };

// export const stripeCreateCheckoutSession = async (req: Request, res: Response) => {
//   try {
//     const { items } = req.body; // items should be an array of { price, quantity }
//     console.log("stripe" , stripe)
//     console.log("stripe" , stripe.checkout)
//     console.log("stripe" , stripe.checkout.sessions)

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card',"alipay"],
//       mode: 'payment',
//       line_items: items, // data send to url via this line 
//       success_url: 'http://localhost:5173/payment-success', // your frontend
//       cancel_url: 'http://localhost:5173/payment-cancel',
//     });

//      res.json({ url: session.url });
//   } catch (error: any) {
//     console.error('Stripe session error:', error);
//     res.status(500).json({ error: error.message || 'Stripe checkout error' });
//   }
// };


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


// 🔹 paypal.orders.OrdersCreateRequest()
// Purpose: To create a new one-time payment order.
// Use case: Used for standard product or service purchases (not recurring).
// Endpoint: POST /v2/checkout/orders

// 🔹 paypal.orders.OrdersCaptureRequest(orderId)
// Purpose: To capture the funds from an approved order.
// Use case: After the user approves the PayPal payment (redirect), this is called to finalize payment.
// Endpoint: POST /v2/checkout/orders/{order_id}/capture

// 🔹 paypal.orders.OrdersAuthorizeRequest(orderId)
// Purpose: Authorize payment for later capture (instead of instant capture).
// Use case: If you're using authorization flow rather than direct capture.
// Endpoint: POST /v2/checkout/orders/{order_id}/authorize

// 🔹 paypal.subscriptions.SubscriptionsCreateRequest()
// Purpose: To create a subscription plan (recurring payments).
// Use case: For monthly/yearly subscriptions.
// Endpoint: POST /v1/billing/subscriptions

// 🔹 paypal.subscriptions.SubscriptionsGetRequest(subscriptionId)
// Purpose: To fetch a subscription’s details.
// Endpoint: GET /v1/billing/subscriptions/{id}

// 🔹 paypal.subscriptions.SubscriptionsCancelRequest(subscriptionId)
// Purpose: To cancel an active subscription.
// Endpoint: POST /v1/billing/subscriptions/{id}/cancel

// 🔹 paypal.subscriptions.SubscriptionsActivateRequest(subscriptionId)
// Purpose: Activate a previously suspended or created subscription.
// Endpoint: POST /v1/billing/subscriptions/{id}/activate

// 🔹 paypal.plans.PlansCreateRequest()
// Purpose: To create a billing plan (needed before creating a subscription).
// Endpoint: POST /v1/billing/plans

// 🔹 paypal.products.ProductsCreateRequest()
// Purpose: To define a product (a container for plans).
// Endpoint: POST /v1/catalogs/products