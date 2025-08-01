

import paypal from "@paypal/checkout-server-sdk";
import paypalClient from '../utils/utils.paypalClients';

// src/controllers/paymentController.ts
import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import { msg } from "../constants/language";
import subscriptionModel from "../models/subscription.model";

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




// export const createStripeSubscription = async (req: Request, res: Response) => {
//   try {
//     const { cus_id, customerEmail } = req.body;
//     const priceId = "price_1Rqtb1CEaskUm5BGfvrSY2RV"; // Your saved recurring price ID

//     if (!cus_id || !customerEmail) {
//       return responseHandler.error(res, msg.common.missingFields);
//     }

//     // 1. Create Stripe customer
//     const customer = await stripe.customers.create({
//       email: customerEmail,
//     });

//     // 2. Create subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: customer.id,
//       items: [{ price: priceId }],
//       payment_behavior: "default_incomplete",
//       expand: ["latest_invoice.payment_intent"],
//     });

//     let paymentIntent: Stripe.PaymentIntent | undefined;
//     if (subscription.latest_invoice && typeof subscription.latest_invoice !== "string") {
//       paymentIntent = (subscription.latest_invoice as any).payment_intent as Stripe.PaymentIntent;
//     }

//     // 3. Save subscription to MySQL (via Sequelize)
//     await subscriptionModel.create({
//       cus_id,
//       subscription_plan_name: "Basic Plan",
//       subscription_plan_id: priceId,
//       subscription_provider_id: subscription.id,
//       subscription_provider: "stripe",
//       subscription_amount: 1.99,
//       subscription_currency: "USD",
//       subscription_status: subscription.status,
//       subscription_start_date: new Date(subscription.start_date * 1000),
//       subscription_end_date: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
//       subscription_trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
//       subscription_is_cancelled: subscription.cancel_at ? true : false,
//       subscription_cancel_at_period_end: subscription.cancel_at_period_end || false,
//     });

//     return responseHandler.success(
//       res,
//       "subscription created sucessfully",
//       {
//         clientSecret: paymentIntent.client_secret,
//         subscriptionId: subscription.id,
//       },
//     );
//   } catch (error: any) {
//     console.error(error);
//     return responseHandler.error(res, msg.common.serverError, 500);
//   }
// };



// export const createStripeSubscription = async (req: Request, res: Response) => {
//   try {
//     const { customerEmail, priceId } = req.body;

//     if (!customerEmail || !priceId) {
//        res.status(400).json({ message: 'Customer email and Price ID are required' });
//     }

//     // Create a new customer
//     const customer = await stripe.customers.create({ email: customerEmail });

//     // Create the subscription for the customer
//     const subscription = await stripe.subscriptions.create({
//       customer: customer.id,
//       items: [{ price: priceId }],
//       payment_behavior: 'default_incomplete',
//       expand: ['latest_invoice.payment_intent'],
//     });

//     const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
//     const paymentIntent = (latestInvoice as any).payment_intent as Stripe.PaymentIntent;

//     if (!paymentIntent?.client_secret) {
//        res.status(500).json({ message: 'Failed to retrieve payment intent.' });
//     }

//     res.status(200).json({
//       message: 'Subscription created successfully',
//       subscriptionId: subscription.id,
//       clientSecret: paymentIntent.client_secret,
//       customerId: customer.id,
//       status: subscription.status
//     });

//   } catch (error: any) {
//     console.error('Error creating subscription:', error);
//     res.status(500).json({ message: 'Failed to create subscription', error: error.message });
//   }
// };


export const createStripeSubscription = async (req: Request, res: Response) => {
  try {
    const { customerEmail , priceId } = req.body;

    if (!customerEmail) {
      return responseHandler.error(res, " cus email not get", resCode.BAD_REQUEST);
    }

    // Step 1: Create Customer (or find if already created)
    const customer = await stripe.customers.create({
      email: customerEmail,
    });

    // Step 2: Create a Stripe Checkout Session for subscription
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"] ,
      customer: customer.id,
      line_items: [
        {
          price: priceId, // replace with your actual price ID
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/payment-fail",
    });

    return responseHandler.success(
      res,
     "Subscription created successfully",
      { checkoutUrl: session.url }
    );
  } catch (error: any) {
    console.error("Stripe Error:", error.message);
    return responseHandler.error(res,"server error", resCode.SERVER_ERROR);
  }
};



// export const createStripeSubscription = async (req: Request, res: Response) => {
//   try {
//     const { customerEmail, priceId, paymentMethodId } = req.body;

//     // Step 1: Create customer
//     const customer = await stripe.customers.create({
//       email: customerEmail,
//       payment_method: paymentMethodId,
//       invoice_settings: {
//         default_payment_method: paymentMethodId,
//       },
//     });

//     // Step 2: Create subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: customer.id,
//       items: [{ price: priceId }],
//       expand: ["latest_invoice.payment_intent"],
//     });

//     return responseHandler.success(res, "Subscription created", { subscription });
//   } catch (error) {
//     console.error("Subscription Error", error);
//     return responseHandler.error(res, "Subscription failed", 500);
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