// src/pages/PaymentSuccess.tsx
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <CheckCircle className="w-14 h-14 mx-auto text-green-600 mb-4" />
        <h1 className="text-xl font-semibold mb-1">Payment Successful</h1>
        <p className="text-sm text-gray-600 mb-5">
          Thank you for your payment. A confirmation email has been sent to you.
        </p>
        <Link
          to="/admin/dashboard"
          className="inline-block px-5 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition duration-300 text-sm"
        >
          Go to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
