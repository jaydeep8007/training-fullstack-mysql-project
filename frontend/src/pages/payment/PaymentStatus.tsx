import { useSearchParams } from "react-router-dom";

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const redirectStatus = searchParams.get("redirect_status");

  if (redirectStatus === "succeeded") {
    window.location.href = "/payment-success";
  } else if (redirectStatus === "failed") {
    window.location.href = "/payment-failed";
  } else {
    return <p>Processing payment...</p>;
  }

  return null;
};

export default PaymentStatusPage;


// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { XCircle } from "lucide-react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// const stripePromise = loadStripe("pk_test_51RoL7OCEaskUm5BGGSd7Kb9313m3D9VzJqur8cBx28ai8ncf5SRcBVncxh7K2tZJKwmCxJjAw0IyYwrtnfN43Xug00vfYuA7XK");

// const PaymentStatusPage = () => {
//   const location = useLocation();
//   const [status, setStatus] = useState<"loading" | "success" | "failed" | "processing">("loading");

//   useEffect(() => {
//     const checkPaymentStatus = async () => {
//       const stripe = await stripePromise;
//       const clientSecret = new URLSearchParams(location.search).get("payment_intent_client_secret");

//       if (!stripe || !clientSecret) {
//         setStatus("failed");
//         return;
//       }

//       const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

//       if (!paymentIntent) {
//         setStatus("failed");
//         return;
//       }

//       switch (paymentIntent.status) {
//         case "succeeded":
//           setStatus("success");
//           break;
//         case "processing":
//           setStatus("processing");
//           break;
//         case "requires_payment_method":
//         default:
//           setStatus("failed");
//           break;
//       }
//     };

//     checkPaymentStatus();
//   }, [location.search]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//       <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg text-center max-w-md">
//         {status === "loading" && <p className="text-lg text-zinc-500">Checking payment status...</p>}
//         {status === "success" && (
//           <>
//             <h2 className="text-2xl font-bold text-green-600">Payment Successful 🎉</h2>
//             <p className="text-zinc-600 mt-2">Thank you! Your payment has been received.</p>
//           </>
//         )}
//         {status === "processing" && (
//           <>
//             <h2 className="text-2xl font-bold text-yellow-500">Payment Processing ⏳</h2>
//             <p className="text-zinc-600 mt-2">We're verifying your payment. You'll receive a confirmation soon.</p>
//           </>
//         )}
//         {status === "failed" && (
//           <>
//             <div className="">
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.4 }}
//         className=""
//       >
//         <XCircle className="w-14 h-14 mx-auto text-red-600 mb-4" />
//         <h1 className="text-xl font-semibold mb-1">Payment Failed</h1>
//         <p className="text-sm text-gray-600 mb-5">
//           Unfortunately, your payment could not be processed. Please try again or contact support.
//         </p>
//         <Link
//           to="/admin/dashboard"
//           className="inline-block px-5 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition duration-300 text-sm"
//         >
//           Return to Dashboard
//         </Link>
//       </motion.div>
//     </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentStatusPage;

