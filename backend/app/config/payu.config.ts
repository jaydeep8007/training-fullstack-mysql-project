// // src/config/payuConfig.ts
// import { PayU } from "payu-websdk";
// import dotenv from "dotenv";

// dotenv.config();

// const payu_key = process.env.PAYU_KEY!;
// const payu_salt = process.env.PAYU_SALT!;
// const payu_env = process.env.PAYU_ENVIRONMENT!; // "test" or "production"

// export const payuClient = new PayU(
//   { key: payu_key, salt: payu_salt },
//   payu_env
// );

const PayU = require("payu-websdk"); //Software Development Kit for the Web

const payu_key = process.env.MERCHANT_KEY;
const payu_salt = process.env.MERCHANT_SALT;

// Determine ENV for PayU (only accepts "TEST" or "PROD")
const PAYU_ENV = process.env.NODE_ENV === "production" ? "PROD" : "TEST";

// create a client
const payuClient = new PayU(
  {
    key: payu_key,
    salt: payu_salt,
  },
  PAYU_ENV
);

export const PayData = {
  payuClient,
  payu_key,
  payu_salt,
};
