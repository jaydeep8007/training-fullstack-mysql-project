import { useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    id: "P-5SU98575AF676020PNCEJEAI", // Real PayPal Plan ID
    name: "Basic Plan",
    description: "Essential features to get started. Limited access.",
    amount: 1.99,
    features: ["1 active project", "Community support", "Email notifications"],
  },
  {
    id: "P-2CD23456CDEF7890XYZ",
    name: "Pro Plan",
    description: "Ideal for professionals. Extended features included.",
    amount: 4.99,
    features: ["10 active projects", "Priority support", "Analytics access"],
  },
  {
    id: "P-3EF23456CDEF7890XYZ",
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

const PaypalSubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [loading, setLoading] = useState(false);

  const handlePaypalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/payment/create-checkout-session", {
        plan_id: selectedPlan.id,
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      console.error("PayPal error:", error.response?.data || error.message);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-full mx-auto px-4 py-4"
    >
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Choose a Subscription Plan</h2>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className={`rounded-xl border p-4 cursor-pointer transition hover:shadow-lg ${
              selectedPlan.id === plan.id
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-2">{plan.description}</p>
            <div className="text-md font-bold text-yellow-700 mb-3">${plan.amount} / month</div>
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

      {/* Checkout Form */}
      <form
        onSubmit={handlePaypalSubmit}
        className="max-w-md mx-auto bg-white rounded-xl shadow p-5 space-y-4 border"
      >
        <h3 className="text-lg font-semibold text-gray-800">Selected Plan</h3>
        <div className="text-md font-medium text-gray-700">
          {selectedPlan.name} - ${selectedPlan.amount} / month
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg text-sm tracking-wide disabled:opacity-50 transition duration-200"
        >
          {loading ? "Redirecting to PayPal..." : "Subscribe with PayPal"}
        </button>
      </form>
    </motion.div>
  );
};

export default PaypalSubscriptionPage;
