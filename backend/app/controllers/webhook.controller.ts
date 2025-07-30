// src/controllers/stripeWebhook.controller.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getSmtpSettings } from "../utils/utils.getSmtpSettings";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return responseHandler.error(res, `Webhook Error: ${err.message}`, resCode.BAD_REQUEST);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("✅ Payment succeeded:", paymentIntent.id);

      const cus_email = paymentIntent.metadata?.cus_email;

      if (!cus_email) {
        console.warn("⚠️ No customer email in metadata. Skipping email.");
        break;
      }

      try {
        const smtpConfig = await getSmtpSettings();
        if (!smtpConfig) {
          console.error("❌ SMTP config not found.");
          break;
        }

        const transporter = nodemailer.createTransport({
          host: smtpConfig.smtp_host,
          port: smtpConfig.smtp_port,
          secure: smtpConfig.smtp_port === 465,
          auth: {
            user: smtpConfig.smtp_user,
            pass: smtpConfig.smtp_password,
          },
        });

        const mailOptions = {
          from: `"Job Portal" <${smtpConfig.smtp_user}>`,
          to: cus_email,
          subject: "🎉 Payment Successful - Thank You!",
          html: `
            <p>Hello,</p>
            <p>Thank you for your payment. Your transaction was successful.</p>
            <p><strong>Payment ID:</strong> ${paymentIntent.id}</p>
            <p><strong>Amount:</strong> ${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}</p>
            <p>We appreciate your business!</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📨 Payment confirmation email sent to ${cus_email}`);
      } catch (err) {
        console.error("❌ Error sending payment email:", err);
      }

      break;
    }

    default:
      console.log(`🔍 Unhandled event type ${event.type}`);
  }

  return responseHandler.success(res,"Stripe webhook event processed successfully.", { received: true }, resCode.OK);
};


// import { Request, Response } from 'express';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   // apiVersion: '2024-04-10', // or your preferred version
// });

// export const handleStripeWebhook = (req: Request, res: Response) => {
//   const sig = req.headers['stripe-signature'] as string;
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err: any) {
//     console.error('❌ Webhook signature verification failed.', err.message);
//      res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // ✅ Handle the event types you care about
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       console.log('✅ Payment succeeded:', paymentIntent.id);
//       // Do something like: update order in DB
//       break;

//     case 'payment_intent.created':
//       console.log('ℹ️ PaymentIntent created:', event.data.object.id);
//       break;

//     case 'charge.succeeded':
//       console.log('✅ Charge succeeded:', event.data.object.id);
//       break;

//     default:
//       console.log(`🔍 Unhandled event type ${event.type}`);
//   }

//   res.status(200).json({ received: true });
// };
