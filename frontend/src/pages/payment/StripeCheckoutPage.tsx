import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Load your Stripe public key
const stripePromise = loadStripe("pk_test_51RoL7OCEaskUm5BGGSd7Kb9313m3D9VzJqur8cBx28ai8ncf5SRcBVncxh7K2tZJKwmCxJjAw0IyYwrtnfN43Xug00vfYuA7XK");

const CheckoutForm = () => {
  const stripe = useStripe();
  console.log("Stripe object:", stripe);
  const elements = useElements();
    console.log("Elements object:", elements);
//   const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!stripe || !elements) return;

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
       return_url: "http://localhost:5173/payment-status", // 👈 must match
    },
  });

   // This error block only catches **immediate** client-side errors
  if (error) {
    console.error("Stripe JS Error:", error.message);
    alert("Payment failed: " + error.message);
    // You could optionally redirect here, but it's not required
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Payment Details</h2>

      <PaymentElement options={{ layout: "tabs" }} />
        {/* tabs, accordian , auto this is the options */}

      <button
        type="submit"
        disabled={!stripe}
        className="w-full py-2 rounded-md bg-black text-white font-medium hover:bg-zinc-800 transition"
      >
        Pay Now
      </button>

      {errorMessage && (
        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
      )}
    </form>
  );
};

const StripeCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};
  const [clientSecret, setClientSecret] = useState("");
  console.log("Plan from location state:", plan);

  console.log("Plan from state:", plan);
  useEffect(() => {
    if (!plan?.amount) {
      navigate("/subscription-planes");
      return;
    }

      const token = localStorage.getItem("adminAccessToken");

  if (!token) {
    console.error("No token found");
    // navigate("/login"); // or handle accordingly
    return;
  }

  let cus_email = "";
  try {
    const decoded: any = jwtDecode(token);
    cus_email = decoded?.email; // assuming JWT includes the user's email as "email"
  } catch (err) {
    console.error("Token decode failed:", err);
    // navigate("/login");
    return;
  }

    axios
      .post("http://localhost:3000/api/v1/payment/stripe/create-stripe-order", {
        amount: plan.amount * 100,
        currency: "usd",
          cus_email : "jrparmar8007@gmail.com", // dynamically from logged-in user
          // cus_email, // dynamically from logged-in user
      })
      .then((res) => setClientSecret(res.data.data.clientSecret))
      .catch((err) => {
        console.error("Error creating payment intent:", err);
        navigate("/subscription-planes");
      });
  }, [plan, navigate]);



// useEffect(() => {
//   if (!plan?.amount) {
//     navigate("/subscription-planes");
//     return;
//   }

//   const token = localStorage.getItem("adminAccessToken");

//   if (!token) {
//     console.error("No token found");
//     return;
//   }

//   let customerEmail = "";
//   let cus_id = "";

//   try {
//     const decoded: any = jwtDecode(token);
//     customerEmail = decoded?.email;
//     cus_id = decoded?.id;
//     console.log("Decoded JWT:", decoded);
//   } catch (err) {
//     console.error("Token decode failed:", err);
//     return;
//   }

// axios
//   .post("http://localhost:3000/api/v1/payment/stripe/stripe-subscription", {
//     customerEmail: "jrparmar8007@gmail.com",        // <-- same as Postman
//     priceId: "price_1MowQULkdIwHu7ixraBm864M",   // <-- your desired plan's price ID
//   })
//   .then((res) => {
//     const { clientSecret } = res.data.data;
//     setClientSecret(clientSecret);
//   })
//   .catch((err) => {
//     console.error("Error creating subscription:", err);
//     navigate("/subscription-planes");
//   });
// }, [plan, navigate]);


  return (
    <div className="min-h-screen bg-zinc-200 dark:bg-zinc-950 flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Plan Summary */}
        <div className="bg-zinc-50 dark:bg-zinc-800 p-6 space-y-4 border-r border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm text-zinc-500 dark:text-zinc-400">You’re subscribing to:</h3>

          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">{plan?.name}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{plan?.description}</p>
          </div>

          <div className="text-lg font-bold text-green-600">${`${plan?.amount?.toFixed(2)}/Month`}</div>

          {plan?.features?.length > 0 && (
            <ul className="list-disc list-inside space-y-1 pt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {plan.features.map((feature: string, idx: number) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Checkout Form */}
        <div className="p-6">
          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  
                },
              }}
            >
              <CheckoutForm />
            </Elements>
          ) : (
            <p className="text-center text-zinc-600 dark:text-zinc-400">Loading checkout...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripeCheckoutPage;
