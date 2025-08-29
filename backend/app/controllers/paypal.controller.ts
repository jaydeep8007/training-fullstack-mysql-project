// src/controllers/paypal.controller.ts
import { Request, Response } from "express";
import paypal from "@paypal/checkout-server-sdk";
import paypalClient from "../utils/paypalClients.utils";

// ✅ Create PayPal Order (One-time Payment)
export const createPaypalOrder = async (req: Request, res: Response) => {
  const { amount, currency } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE", // directly capture funds after approval
    purchase_units: [
      {
        amount: {
          currency_code: currency || "USD",
          value: amount.toString(),
        },
      },
    ],
    application_context: {
      brand_name: "My Business",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url: "http://localhost:5173/paypal-success", // frontend success page
  cancel_url: "http://localhost:5173/paypal-cancel",  // frontend cancel page
    },
  });

  try {
    const order = await paypalClient.execute(request);
    const approvalUrl = order.result.links.find((link) => link.rel === "approve")?.href;

     res.status(200).json({
      success: true,
      orderId: order.result.id,
      approvalUrl,
    });
  } catch (err) {
    console.error("❌ PayPal Order Creation Error:", err);
     res.status(500).json({
      success: false,
      message: "Failed to create PayPal order",
    });
  }
};

// ✅ Capture PayPal Order (after approval)
export const capturePaypalOrder = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({}); // empty body required

  try {
    const capture = await paypalClient.execute(request);

     res.status(200).json({
      success: true,
      message: "Payment captured successfully",
      data: capture.result,
    });
  } catch (err) {
    console.error("❌ PayPal Capture Error:", err);
     res.status(500).json({
      success: false,
      message: "Failed to capture PayPal payment",
    });
  }
};

