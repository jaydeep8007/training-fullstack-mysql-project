import { useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic Plan",
    description: "Essential features to get started. Limited access.",
    amount: 99,
    features: ["1 active project", "Community support", "Email notifications"],
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "Ideal for professionals. Extended features included.",
    amount: 299,
    features: ["10 active projects", "Priority support", "Analytics access"],
  },
  {
    id: "premium",
    name: "Premium Plan",
    description: "Full access to all features. VIP support.",
    amount: 499,
    features: [
      "Unlimited projects",
      "24/7 premium support",
      "Advanced analytics",
      "Early access to beta features",
    ],
  },
];

const StripeSubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      items: [
        {
          quantity: 1,
          price_data: {
            currency: "inr",
            unit_amount: selectedPlan.amount * 100,
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
            },
          },
        },
      ],
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
    };

    try {
      const response = await axios.post("http://localhost:3000/api/v1/stripe/create-checkout-session", payload);
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      console.error("Stripe error:", error.response?.data || error.message);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Choose a Subscription Plan</h2>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className={`rounded-xl border p-5 cursor-pointer transition hover:shadow-md ${
              selectedPlan.id === plan.id
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <h3 className="text-md font-bold mb-1 text-gray-900">{plan.name}</h3>
            <p className="text-xs text-gray-600 mb-2">{plan.description}</p>
            <div className="text-sm font-bold text-indigo-700 mb-3">₹{plan.amount} / month</div>
            <ul className="text-xs text-gray-700 space-y-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Checkout Form */}
      <div className="max-w-full mx-auto p-6 bg-white rounded-xl shadow">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Selected Plan</label>
            <input
              value={selectedPlan.name}
              readOnly
              className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Plan Description</label>
            <textarea
              value={selectedPlan.description}
              readOnly
              className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-600"
              rows={2}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Price (INR)</label>
            <input
              value={`₹${selectedPlan.amount}`}
              readOnly
              className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded text-sm"
          >
            Subscribe to {selectedPlan.name}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StripeSubscriptionPage;
