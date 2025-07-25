// utils/paypalClient.ts
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const Environment = process.env.NODE_ENV === 'production'
  ? checkoutNodeJssdk.core.LiveEnvironment
  : checkoutNodeJssdk.core.SandboxEnvironment;

const client = new checkoutNodeJssdk.core.PayPalHttpClient(
  new Environment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
);

export default client;
