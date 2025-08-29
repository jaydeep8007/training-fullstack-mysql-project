// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import logger from 'morgan';

// import bodyParser from 'body-parser';
// import cors from 'cors'; //For cross domain error

// import cookieParser from 'cookie-parser';

// //db connections
// import sequelize from './config/sequelize';

// /* MAIN ROUTES */
// import router from './routes/main.route';

// // Load environment variables from .env file
// dotenv.config();

// // Initialize Express application
// const app = express();

// // Middleware
// app.use(cors());
// // app.use(
// //   cors({
// //     origin: ["http://localhost:5173","http://localhost:5174" , "http://localhost:3000"], // ✅ your frontend URL
// //     credentials: true,               // ✅ allow cookies to be sent
// //   })
// // );
// app.use(cookieParser()); // Parse cookies
// app.use(express.json()); // Parse JSON request bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// app.use(express.json());
// app.use(logger('dev'));

// app.use(
//   bodyParser.urlencoded({
//     extended: false,
//   }),
// );
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(logger('combined')); // Just uncomment this line to show logs.

// function haltOnTimedout(req: any, res: any, next: any) {
//   if (!req.timedout) next();
// }

// /* MAIN ROUTES FOR APP */
// app.use('/api/v1', router);

// const PORT = process.env.PORT || 3000;

// // Import your models with associations
// import models from './models/index';
// import { initLanguage } from './constants/language';

// app.listen(PORT, async () => {
//   try {
//     await models.sequelize.authenticate();
//     console.log('✅ Database connection has been established successfully.');

//     // Sync all models and associations
//     await models.sequelize.sync({ alter: true });
//     console.log('✅ Database synced successfully.');

//         // ✅ Load language from global config table
//     await initLanguage();

//   } catch (error) {
//     console.error('❌ Unable to connect to the database or sync:', error);
//   }

//   console.log(`🚀 App is listening on port ${PORT} for demo Node server`);
// });

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// DB connection
import sequelize from './config/sequelize';
import models from './models/index';
import { initLanguage } from './constants/language';

/* MAIN ROUTES */
import router from './routes/main.route';
import { handleStripeWebhook } from './controllers/webhook.controller';

// Initialize Express app
const app = express();

app.post(
  '/stripe/webhook',
  // '/api/v1/payment/stripe/webhook',
  bodyParser.raw({ type: 'application/json' }), // Required for Stripe signature verification
  handleStripeWebhook,
);

// ✅ Proper CORS setup (must be before any routes or cookies)
app.use(
  cors({
    origin: ['http://localhost:5173'], // Add more origins as needed
    credentials: true,
  }),
);
// ✅ Core Middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Logging
app.use(logger('dev'));

// ✅ Main API Routes
app.use('/api/v1', router);

// import { convertUSDtoINR } from './utils/currency.utils';
const { PayData } = require('./config/payu.config');
const crypto = require('crypto');

app.post('/get-payment', async (req, res) => {
  try {
    const txn_id = 'PAYU_MONEY_' + Math.floor(Math.random() * 8888888);
    const { amount, product, firstname, email, mobile } = req.body;

    // GST rate - 18%
    const gstRate = 0.18;
    const gstAmount = Number((amount * gstRate).toFixed(2));
    const totalAmount = Number((amount + gstAmount).toFixed(2));

    // Dummy test address
    const addressLine1 = '123 Test Street';
    const addressLine2 = 'Apt 4B';
    const city = 'Ahmedabad';
    const state = 'Gujarat';
    const pincode = '380001';

    let udf1 = addressLine1;
    let udf2 = addressLine2;
    let udf3 = city;
    let udf4 = state;
    let udf5 = pincode;

    // Optionally add GST info inside product object for clarity (or keep as is)
    const productWithGST = {
      ...product,
      gst: gstAmount,
      totalPrice: totalAmount,
    };

    // Note: hash should be created with totalAmount to match payment
    const hashString = `${PayData.payu_key}|${txn_id}|${totalAmount}|${JSON.stringify(productWithGST)}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PayData.payu_salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const data = await PayData.payuClient.paymentInitiate({
      isAmountFilledByCustomer: false,
      txnid: txn_id,
      amount: totalAmount,
      currency: 'INR',
      productinfo: JSON.stringify(productWithGST),
      firstname: firstname,
      email: email,
      phone: mobile,
      surl: `http://localhost:3000/payment-success-redirect`,
      furl: `http://localhost:3000/payment-fail-redirect`,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5
    });

    res.send(data);
  } catch (error) {
    res.status(400).send({
      msg: error.message,
      stack: error.stack
    });
  }
});


app.post("/payment-success-redirect", async (req, res) => {
    const txnid = req.body.txnid;
    
    // Extra safety: verify payment with PayU
    const verified_Data = await PayData.payuClient.verifyPayment(txnid);
    const data = verified_Data.transaction_details[txnid];

    res.redirect(`http://localhost:5173/payment-success`);
});

app.post("/payment-fail-redirect",async (req, res) => {
     const txnid = req.body.txnid;

    // Extra safety: verify payment with PayU
    const verified_Data = await PayData.payuClient.verifyPayment(txnid);
    const data = verified_Data.transaction_details[txnid];
    res.redirect(`http://localhost:5173/payment-fail`);
});


// Webhook endpoint to receive PayU notifications
app.post('/api/payments/payu-webhook', (req, res) => {
  try {
    const paymentData = req.body;  // The payload sent by PayU webhook

    console.log('Received PayU webhook:', paymentData);

    // TODO: Verify webhook authenticity (if PayU provides signature or hash)

    // TODO: Process payment status here:
    // e.g. update order status in DB, send confirmation emails, etc.

    // Respond with 200 OK to acknowledge receipt
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Server error');
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await models.sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    await models.sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully.');

    await initLanguage(); // Load language config
    console.log('✅ Global language configuration loaded.');
  } catch (error) {
    console.error('❌ Unable to connect to the database or sync:', error);
  }
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
