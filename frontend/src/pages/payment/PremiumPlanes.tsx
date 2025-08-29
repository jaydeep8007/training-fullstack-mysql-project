// import { useState } from "react";
// import axios from "axios";
// import { CheckCircle } from "lucide-react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const plans = [
//   {
//     id: "P-5SU98575AF676020PNCEJEAI",
//     priceId : "price_1Rqtb1CEaskUm5BGfvrSY2RV",
//     name: "Basic Plan",
//     description: "Essential features to get started. Limited access.",
//     amount: 1.99,
//     features: ["1 active project", "Community support", "Email notifications"],
//   },
//   {
//     id: "P-2MC60425NR326760XNCFQTNA",
//     priceId :"price_1RrFGkCEaskUm5BGYIReJ61g",
//     name: "Pro Plan",
//     description: "Ideal for professionals. Extended features included.",
//     amount: 4.99,
//     features: ["10 active projects", "Priority support", "Analytics access"],
//   },
//   {
//     id: "P-82P10349T50156043NCFRMNA",
//     priceId:"price_1RrFO9CEaskUm5BGdogSMTO3",
//     name: "Premium Plan",
//     description: "Full access to all features. VIP support.",
//     amount: 9.99,
//     features: [
//       "Unlimited projects",
//       "24/7 premium support",
//       "Advanced analytics",
//       "Early access to beta features",
//     ],
//   },
// ];

// const StripeSubscriptionPage = () => {
//   const [selectedPlan, setSelectedPlan] = useState(plans[0]);
//   const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
//   const [loading, setLoading] = useState(false);
//   const [stripeOption, setStripeOption] = useState("one-time"); // default

//   const navigate = useNavigate();

//   // const handleStripeSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setLoading(true);

//   //   try {
//   //     const response = await axios.post("http://localhost:3000/api/v1/payment/stripe/create-stripe-order", {
//   //       items: [
//   //         {
//   //           quantity: 1,
//   //           price_data: {
//   //             currency: "USD",
//   //             unit_amount: selectedPlan.amount * 100,
//   //             product_data: {
//   //               name: selectedPlan.name,
//   //               description: selectedPlan.description,
//   //             },
//   //           },
//   //         },
//   //       ],
//   //       success_url: "http://localhost:5173/payment-success",
//   //       cancel_url: "http://localhost:5173/payment-cancel",
//   //     });

//   //     if (response.data?.url) {
//   //       window.location.href = response.data.url;
//   //     }
//   //   } catch (error: any) {
//   //     console.error("Stripe error:", error.response?.data || error.message);
//   //     alert("Something went wrong.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// //   const handleStripeSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();

// //   // Only send amount to next page
// //   navigate("/stripe-checkout-page", {
// //    state: {
// //     plan: {
// //       name: selectedPlan.name,
// //       description: selectedPlan.description,
// //       amount: selectedPlan.amount,
// //       features: selectedPlan.features, // optional array

// //     },
// //   },
// //   });
// // };

// const handleStripeSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!selectedPlan) {
//     return alert("Please select a plan.");
//   }

//   if (stripeOption === "one-time") {
//     // Just redirect to checkout page with plan details
//     navigate("/stripe-checkout-page", {
//       state: {
//         type: "oneTime",
//         plan: {
//           name: selectedPlan.name,
//           description: selectedPlan.description,
//           amount: selectedPlan.amount,
//           features: selectedPlan.features,
//         },
//       },
//     });
//   }

//   else if (stripeOption === "subscription") {
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/v1/payment/stripe/stripe-subscription",
//         {
//           customerEmail:"jrparmar8007@gmail.com",
//           priceId: selectedPlan.priceId,
//           // priceId : "price_1Rqtb1CEaskUm5BGfvrSY2RV"
//         }
//       );

//       const { checkoutUrl } = response.data.data;

//       if (checkoutUrl) {
//         window.location.href = checkoutUrl; // 🔁 Redirect to Stripe Checkout
//       } else {
//         alert("Failed to create subscription session.");
//       }
//     } catch (error) {
//       console.error("Stripe Subscription Error:", error);
//       alert("Subscription process failed. Please try again.");
//     }
//   }
// };

//   const handlePaypalSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post("http://localhost:3000/api/v1/payment/paypal/create-paypal-order", {
//         amount: selectedPlan.amount,
//         currency: "USD",
//       });

//       if (response.data?.url) {
//         window.location.href = response.data.url;
//       }
//     } catch (error: any) {
//       console.error("PayPal error:", error.response?.data || error.message);
//       alert("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//         <motion.div
//            initial={{ scale: 0.95, opacity: 0 }}
//            animate={{ scale: 1, opacity: 1 }}
//            transition={{ duration: 0.4 }}
//     className="max-w-full  mx-auto px-4 py-4">
//       <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">Choose a Subscription Plan</h2>

//       {/* Plan Cards */}
//       <div className="grid  grid-cols-1 md:grid-cols-3 gap-4 mb-10">
//         {plans.map((plan) => (
//           <div
//             key={plan.id}
//             onClick={() => setSelectedPlan(plan)}
//             className={` hover:scale-10 rounded-xl border p-4 cursor-pointer transition hover:shadow-lg ${
//               selectedPlan.id === plan.id
//                 ? "border-blue-600 bg-purple-50"
//                 : "border-gray-200 bg-white"
//             }`}
//           >
//             <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
//             <p className="text-sm text-gray-600 mt-1 mb-2">{plan.description}</p>
//            <div className="text-md font-bold text-blue-700 mb-3">${plan.amount} / month</div>
//             <ul className="text-sm text-gray-700 space-y-1">
//               {plan.features.map((feature, i) => (
//                 <li key={i} className="flex items-center gap-2">
//                   <CheckCircle size={16} className="text-green-500" />
//                   {feature}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>

//       {/* Checkout Form */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Subscription Info */}
//         <div className="bg-white rounded-lg shadow p-4 space-y-4 border">
//           <h3 className="text-lg font-semibold text-gray-800">Selected Plan Summary</h3>
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Plan</label>
//             <input
//               value={selectedPlan.name}
//               readOnly
//               className="w-full text-sm   border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-700"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-gray-600">Description</label>
//             <textarea
//               value={selectedPlan.description}
//               readOnly
//               rows={2}
//               className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-700"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-gray-600">Price</label>
//             <input
//               value={`$${selectedPlan.amount}`}
//               readOnly
//               className="w-full text-sm  border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-700"
//             />
//           </div>
//         </div>

//         {/* Payment Method & Submit */}
//         <form
//           onSubmit={paymentMethod === "stripe" ? handleStripeSubmit : handlePaypalSubmit}
//           className="bg-white rounded-xl shadow p-5 space-y-4 border"
//         >
//           <h3 className="text-lg font-semibold text-gray-800">Payment Method</h3>

//           <div className="grid grid-cols-1 gap-4">
//             {/* Stripe Option */}
//    {/* Stripe Option with Sub-options */}
// <label
//   htmlFor="stripe"
//   className={`flex flex-col items-start border rounded-lg px-4 py-3 cursor-pointer transition ${
//     paymentMethod === "stripe" ? "border-blue-600 bg-purple-50" : "border-gray-300 bg-white"
//   } hover:shadow-md`}
// >
//   <div className="flex items-center justify-between w-full">
//     <div className="flex items-center gap-3">
//       <img
//         src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg"
//         alt="Stripe"
//         className="h-5 w-5"
//       />
//       <span className="text-sm font-medium text-gray-800">Pay with Stripe</span>
//     </div>
//     <input
//       type="radio"
//       id="stripe"
//       name="payment"
//       value="stripe"
//       checked={paymentMethod === "stripe"}
//       onChange={() => setPaymentMethod("stripe")}
//       className="hidden"
//     />
//     {paymentMethod === "stripe" && (
//       <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//       </svg>
//     )}
//   </div>

//   {/* Stripe Sub-options */}
//   {paymentMethod === "stripe" && (
//     <div className="mt-4 ml-6 flex flex-col gap-2">
//       <label className="flex items-center gap-2 text-sm text-gray-700">
//         <input
//           type="radio"
//           name="stripeOption"
//           value="one-time"
//           checked={stripeOption === "one-time"}
//           onChange={() => setStripeOption("one-time")}
//         />
//         One-Time Payment
//       </label>
//       <label className="flex items-center gap-2 text-sm text-gray-700">
//         <input
//           type="radio"
//           name="stripeOption"
//           value="subscription"
//           checked={stripeOption === "subscription"}
//           onChange={() => setStripeOption("subscription")}
//         />
//         Monthly Subscription
//       </label>
//     </div>
//   )}
// </label>

//             {/* PayPal Option */}
//             <label
//               htmlFor="paypal"
//               className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition ${
//                 paymentMethod === "paypal" ? "border-yellow-500 bg-yellow-50" : "border-gray-300 bg-white"
//               } hover:shadow-md`}
//             >
//               <div className="flex items-center gap-3">
//                 <img
//                   src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
//                   alt="PayPal"
//                   className="h-5 w-5"
//                 />
//                 <span className="text-sm font-medium text-gray-800">Pay with PayPal</span>
//               </div>
//               <input
//                 type="radio"
//                 id="paypal"
//                 name="payment"
//                 value="paypal"
//                 checked={paymentMethod === "paypal"}
//                 onChange={() => setPaymentMethod("paypal")}
//                 className="hidden"
//               />
//               {paymentMethod === "paypal" && (
//                 <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                 </svg>
//               )}
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading || !paymentMethod}
//             className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm tracking-wide disabled:opacity-50 transition duration-200"
//           >
//             {loading ? "Processing..." : "Purchase"}
//           </button>
//         </form>
//       </div>
//     </motion.div>
//   );
// };

// export default StripeSubscriptionPage;

import { useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";

const plans = [
  {
    id: "P-5SU98575AF676020PNCEJEAI",
    priceId: "price_1Rqtb1CEaskUm5BGfvrSY2RV",
    name: "Basic Plan",
    description: "Essential features to get started. Limited access.",
    amount: 1.99,
    features: ["1 active project", "Community support", "Email notifications"],
  },
  {
    id: "P-2MC60425NR326760XNCFQTNA",
    priceId: "price_1RrFGkCEaskUm5BGYIReJ61g",
    name: "Pro Plan",
    description: "Ideal for professionals. Extended features included.",
    amount: 4.99,
    features: ["10 active projects", "Priority support", "Analytics access"],
  },
  {
    id: "P-82P10349T50156043NCFRMNA",
    priceId: "price_1RrFO9CEaskUm5BGdogSMTO3",
    name: "Premium Plan",
    description: "Full access to all features. VIP support.",
    amount: 9.99,
    features: [
      "Unlimited projects",
      "24/7 premium support",
      "Advanced analytics",
      "Early access to beta features",
    ],
  },
];

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "paypal" | "payu"
  >("stripe");
  const [stripeOption, setStripeOption] = useState("one-time");
  const [loading, setLoading] = useState(false);
  const [payuData, setPayuData] = useState(null);
const [formAction, setFormAction] = useState("");

  const navigate = useNavigate();



  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (stripeOption === "one-time") {
      navigate("/stripe-checkout-page", {
        state: {
          type: "oneTime",
          plan: selectedPlan,
        },
      });
    } else if (stripeOption === "subscription") {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/payment/stripe/stripe-subscription",
          {
            customerEmail: "jaydeep@example.com",
            priceId: selectedPlan.priceId,
          }
        );

        const { checkoutUrl } = response.data.data;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          alert("Failed to create subscription session.");
        }
      } catch (error) {
        console.error("Stripe error:", error);
        alert("Something went wrong.");
      }
    }
  };
  //paypal submit handler
// PayPal Submit Handler
const handlePaypalSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/payment/paypal/create-paypal-order",
      {
        amount: selectedPlan.amount,
        currency: "USD",
      }
    );

    if (response.data?.approvalUrl) {
      // redirect user to PayPal approval page
      window.location.href = response.data.approvalUrl;
    } else {
      alert("Failed to get PayPal approval link");
    }
  } catch (error: any) {
    console.error("PayPal error:", error.response?.data || error.message);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};


const handlePayuSubmit = async () => {
  try {
    const res = await fetch("http://localhost:3000/get-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Dummy body — update as needed
      body: JSON.stringify({
        amount:Number(selectedPlan.amount.toFixed(2)) * 87.77 ,
        firstname: "Jaydeep",
        email: "jaydeep@example.com",
        phone: "9999999999",
        productinfo: "Gold Subscription",
      }),
    });

    const html = await res.text();

    // Inject the HTML into a form and auto-submit
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
    div.querySelector("form")?.submit();
  } catch (err) {
    console.error("Failed to submit PayU form:", err);
  }
};



  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-full mx-auto px-4 py-4"
    >
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
        Choose a Subscription Plan
      </h2>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className={`rounded-xl border p-4 cursor-pointer transition hover:shadow-lg ${
              selectedPlan.id === plan.id
                ? "border-blue-600 bg-purple-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-2">
              {plan.description}
            </p>
            <div className="text-md font-bold text-blue-700 mb-3">
              ${plan.amount} / month
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Payment Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan Summary */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4 border">
          <h3 className="text-lg font-semibold text-gray-800">
            Selected Plan Summary
          </h3>
          <input
            value={selectedPlan.name}
            readOnly
            className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-700"
          />
          <textarea
            value={selectedPlan.description}
            readOnly
            rows={2}
            className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-700"
          />
          <input
            value={`$${selectedPlan.amount}`}
            readOnly
            className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-700"
          />
        </div>

        {/* Payment Form */}
        <form
          onSubmit={
            paymentMethod === "stripe"
              ? handleStripeSubmit
              : paymentMethod === "paypal"
              ? handlePaypalSubmit
              : handlePayuSubmit
          }
          className="bg-white rounded-xl shadow p-5 space-y-4 border"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Payment Method
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {/* Stripe */}
            <label
              htmlFor="stripe"
              className={`flex flex-col items-start border rounded-lg px-4 py-3 cursor-pointer transition ${
                paymentMethod === "stripe"
                  ? "border-blue-600 bg-purple-50"
                  : "border-gray-300 bg-white"
              } hover:shadow-md`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg"
                    alt="Stripe"
                    className="h-5 w-5"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    Pay with Stripe
                  </span>
                </div>
                <input
                  type="radio"
                  id="stripe"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="hidden"
                />
              </div>
              {paymentMethod === "stripe" && (
                <div className="mt-4 ml-6 flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="stripeOption"
                      value="one-time"
                      checked={stripeOption === "one-time"}
                      onChange={() => setStripeOption("one-time")}
                    />
                    One-Time Payment
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="stripeOption"
                      value="subscription"
                      checked={stripeOption === "subscription"}
                      onChange={() => setStripeOption("subscription")}
                    />
                    Recurring Payment
                  </label>
                </div>
              )}
            </label>

            {/* PayPal */}
            <label
              htmlFor="paypal"
              className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition ${
                paymentMethod === "paypal"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300 bg-white"
              } hover:shadow-md`}
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                  alt="PayPal"
                  className="h-5 w-5"
                />
                <span className="text-sm font-medium text-gray-800">
                  Pay with PayPal
                </span>
              </div>
              <input
                type="radio"
                id="paypal"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="hidden"
              />
            </label>
            {/* PayPal Option with Smart Buttons */}
            {/* <label className={`flex flex-col border rounded-lg px-4 py-3 cursor-pointer ${paymentMethod === "paypal" ? "border-yellow-500 bg-yellow-50" : "border-gray-300 bg-white"}`}>
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="h-5 w-5" />
                  PayPal
                </span>
                <input type="radio" name="payment" value="paypal" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} className="hidden" />
              </div>

              {paymentMethod === "paypal" && (
                <div className="mt-4">
                  <PayPalButtons
                    style={{ layout: "vertical", color: "gold" }}
                    createOrder={async () => {
                      const res = await axios.post("http://localhost:3000/api/v1/payment/paypal/create-paypal-order", {
                        amount: selectedPlan.amount,
                        currency: "USD",
                      });
                      return res.data.id; // return PayPal orderId
                    }}
                    onApprove={async (data) => {
                      const res = await axios.post("http://localhost:3000/api/v1/payment/paypal/capture-order", {
                        orderId: data.orderID,
                      });
                      alert("✅ Payment successful: " + res.data.data.payer.name.given_name);
                    }}
                  />
                </div>
              )}
            </label> */}

            {/* PayU */}
            <label
              htmlFor="payu"
              className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition ${
                paymentMethod === "payu"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-white"
              } hover:shadow-md`}
            >
              <div className="flex items-center gap-3">
                <img
                  src="payu.png"
                  alt="PayU"
                  className="h-5 w-5"
                />
                <span className="text-sm font-medium text-gray-800">
                  Pay with PayU
                </span>
              </div>
              <input
                type="radio"
                id="payu"
                name="payment"
                value="payu"
                checked={paymentMethod === "payu"}
                onChange={() => setPaymentMethod("payu")}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !paymentMethod}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm tracking-wide disabled:opacity-50 transition duration-200"
          >
            {loading ? "Processing..." : "Purchase"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default SubscriptionPage;
