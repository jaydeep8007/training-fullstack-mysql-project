import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <XCircle className="w-14 h-14 mx-auto text-red-600 mb-4" />
        <h1 className="text-xl font-semibold mb-1">Payment Failed</h1>
        <p className="text-sm text-gray-600 mb-5">
          Unfortunately, your payment could not be processed. Please try again or contact support.
        </p>
        <Link
          to="/admin/dashboard"
          className="inline-block px-5 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition duration-300 text-sm"
        >
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
