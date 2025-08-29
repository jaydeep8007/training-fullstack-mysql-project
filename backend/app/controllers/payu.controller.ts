// src/controllers/paymentController.ts
import { Request, Response } from "express";
import crypto from "crypto";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import { msg } from "../constants/language";
import { convertUSDtoINR } from "../utils/currency.utils";


export const initiatePayUPayment = async (req, res) => {
  try {
    const { amount, firstname, email, phone, productinfo } = req.body;

    if (!amount || !firstname || !email || !phone || !productinfo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const PAYU_KEY = process.env.MERCHANT_KEY;
    const PAYU_SALT = process.env.MERCHANT_SALT;
    const PAYU_BASE_URL = process.env.PAYU_BASE_URL || "https://test.payu.in/_payment";

    if (!PAYU_KEY || !PAYU_SALT) {
      return res.status(500).json({ message: "PayU keys not configured" });
    }

    const txnid = `txn_${Date.now()}`;
    const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const payuPayload = {
      key: PAYU_KEY,
      txnid,
      amount: amount.toString(),
      productinfo,
      firstname,
      email,
      phone,
      surl: "http://localhost:3000/payment-success-redirect",
      furl: "http://localhost:3000/payment-fail-redirect",
      hash,
      service_provider: "payu_paisa",
    };

    // You can either construct an auto-submit form here manually
    // or use a PayU client library if you have one

    // For simplicity, let's just send the data back to frontend for now:
    return res.json({
      formAction: PAYU_BASE_URL,
      payuPayload,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};


// export const payuResponseHandler = (req: Request, res: Response) => {
//   const payuResponse = req.body;

//   console.log("📩 PayU Response:", payuResponse);

//   // Verify hash if needed
//   // Update DB based on status: success/failure

//   res.status(200).json({ message: "Payment status received." });
// };

// // src/controllers/paymentController.ts
// import { Request, Response } from "express";
// import crypto from "crypto";
// import { responseHandler } from "../services/responseHandler.service";
// import { resCode } from "../constants/resCode";
// import { msg } from "../constants/language";

// // const PAYU_MERCHANT_KEY = 'gtKFFx';
// // const PAYU_MERCHANT_SALT = '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW'; // ✅ correct test salt

// const PAYU_MERCHANT_KEY = 'gtKFFx';
// const PAYU_MERCHANT_SALT = '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW'; // ✅ correct test salt

// export const initiatePayUPayment = async (req: Request, res: Response) => {
//   try {
//     console.log("🚀 PayU Order Request Received");
//     console.log("📥 Incoming Body:", req.body);

//     const {
//       amount,
//       firstname,
//       email,
//       phone,
//       productinfo ,
//     } = req.body;

//     console.log(".......productinfo:", req.body.productinfo);
//     // 🔍 Validate inputs
//     if (!amount || !firstname || !email || !phone) {
//       console.warn("❌ Missing Fields");
//       return responseHandler.error(res, "all fields are req", resCode.BAD_REQUEST);
//     }
//     console.log(".......productinfo:", req.body.productinfo);
//     // 🔍 Validate ENV
//     const {
//       PAYU_KEY,
//       PAYU_SALT,

//       PAYU_BASE_URL,
//     } = process.env;

//     const PAYU_SUCCESS_URL = 'https://8d06c988041e.ngrok-free.app/payment-success'
//     const PAYU_FAILURE_URL = 'https://8d06c988041e.ngrok-free.app/payment-fail'
//     console.log(PAYU_SUCCESS_URL, PAYU_FAILURE_URL, PAYU_BASE_URL);

//     if (!PAYU_KEY || !PAYU_SALT || !PAYU_SUCCESS_URL || !PAYU_FAILURE_URL || !PAYU_BASE_URL) {
//       console.error("❗ PayU ENV not set");
//       return responseHandler.error(res, "Server config error", resCode.SERVER_ERROR);
//     }

//     const txnid = `txn_${Date.now()}`;
//     console.log("🔑 Generated txnid:", txnid);

//     const payuData = {
//       key: PAYU_KEY,
//       txnid,
//       amount: amount.toString(),
//       productinfo,
//       firstname,
//       email,
//       phone,
//       surl: PAYU_SUCCESS_URL,
//       furl: PAYU_FAILURE_URL,
//       service_provider: "payu_paisa",
//     };

//     // 🔐 Construct Hash

// const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_MERCHANT_SALT}`;
// const hash = crypto.createHash('sha512').update(hashString).digest('hex');
// try {
//   const hashSequence = `${PAYU_KEY}|${txnid}|${payuData.amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
//   const hash = crypto.createHash("sha512").update(hashSequence).digest("hex");

//   console.log("✅... Generated Hashsequence:", hashSequence);
//   console.log("✅ Generated Hash:", hash);
// } catch (err) {
//   console.error("❌ Hash Generation Failed:", err);
// }

//     const responsePayload = {
//       formAction: PAYU_BASE_URL,
//       payuData: {
//         ...payuData,
//         hash,

//       },
//     };

//     console.log("✅ Returning Payload to Client:", responsePayload);
//     return responseHandler.success(res, "PayU order created ...", responsePayload);
//   } catch (error: any) {
//     console.error("🔥 PayU order creation error:", error.message || error);
//     return responseHandler.error(res, "PayU order creation failed", resCode.SERVER_ERROR);
//   }
// };

// src/controllers/paymentController.ts

// src/controllers/paymentController.ts

// import { Request, Response } from "express";
// import crypto from "crypto";
// import { PayData } from "../config/paydata"; // adjust this path if needed

// const port = 3000;

// export const initiatePayuPayment = async (req: Request, res: Response) => {
//   try {
//     const txn_id = "PAYU_MONEY_" + Math.floor(Math.random() * 8888888);
//     const { amount, product, firstname, email, mobile } = req.body;

//     const udf1 = "";
//     const udf2 = "";
//     const udf3 = "";
//     const udf4 = "";
//     const udf5 = "";

//     const hashString = `${PayData.payu_key}|${txn_id}|${amount}|${JSON.stringify(
//       product
//     )}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PayData.payu_salt}`;

//     const hash = crypto.createHash("sha512").update(hashString).digest("hex");

//     const data = await PayData.payuClient.paymentInitiate({
//       isAmountFilledByCustomer: false,
//       txnid: txn_id,
//       amount,
//       currency: "INR",
//       productinfo: JSON.stringify(product),
//       firstname,
//       email,
//       phone: mobile,
//       surl: `http://localhost:${port}/api/v1/payment/payu/verify/${txn_id}`,
//       furl: `http://localhost:${port}/api/v1/payment/payu/verify/${txn_id}`,
//       hash,
//     });

//     res.send(data);
//   } catch (error: any) {
//     res.status(400).send({
//       msg: error.message,
//       stack: error.stack,
//     });
//   }
// };

// export const verifyPayuPayment = async (req: Request, res: Response) => {
//   try {
//     const { txnid } = req.params;

//     const verified_Data = await PayData.payuClient.verifyPayment(txnid);
//     const data = verified_Data.transaction_details[txnid];

//     // redirect to frontend with status and txnid
//     res.redirect(`http://localhost:5173/payment/${data.status}/${data.txnid}`);
//   } catch (error: any) {
//     res.status(500).send({
//       msg: "Payment verification failed",
//       error: error.message,
//     });
//   }
// };
