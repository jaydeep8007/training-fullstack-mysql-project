import { useEffect, useState } from "react";
import axios from "axios";

interface Subscription {
  id: string;
  status: string;
  plan: {
    nickname: string;
    amount: number;
    interval: string;
  };
  current_period_end: number;
}

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const customerEmail = "jaydeep@example.com"; // 👈 Hardcoded for now

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/payment/stripe/my-subscription`,
          {
            params: { customerEmail }, // ✅ Preferred way to send query param
          }
        );

        setSubscriptions(res.data.data || []);
      } catch (err: any) {
        console.error("❌ Error fetching subscriptions:", err);
        setError("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-semibold mb-4 text-purple-700">My Subscriptions</h1>

      {/* 🔄 Loading state */}
      {loading && <p className="text-gray-600">Loading your subscriptions...</p>}

      {/* ❌ Error state */}
      {error && <p className="text-red-600">{error}</p>}

      {/* 📭 Empty state */}
      {!loading && !subscriptions.length && !error && (
        <p className="text-gray-500">No subscriptions found for your account.</p>
      )}

      {/* 📦 Subscription List */}
      {!loading && subscriptions.length > 0 && (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-medium text-purple-600">
                    {sub.plan.nickname}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">
                    {sub.plan.interval} subscription
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold text-green-600">
                    ₹{sub.plan.amount / 100}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      sub.status === "active"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {sub.status}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Ends on:{" "}
                {new Date(sub.current_period_end * 1000).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubscriptions;
