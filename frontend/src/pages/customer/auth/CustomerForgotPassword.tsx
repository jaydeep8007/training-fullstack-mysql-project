import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CustomerForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/customer/auth/forget-password`,
        { cus_email: email }
      );

      toast.success(res.data.message || "Reset link sent!");
      navigate("/customer-login");
    } catch (error: any) {
      const backendErrors = error?.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const fieldErrors: Record<string, string> = {};
        backendErrors.forEach((err: any) => {
          if (err.path && err.message) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-sm md:max-w-md p-6 bg-gray-900 text-white flex-col flex items-center gap-4 rounded-xl shadow-slate-700 shadow-xl"
      >
        <h2 className="text-lg md:text-xl font-semibold">Forgot Password</h2>
        <p className="text-xs md:text-sm text-gray-400 text-center">
          Enter your email to receive a password reset link.
        </p>

        <div className="w-full flex flex-col gap-1">
          <input
            type="email"
            className="w-full px-4 py-3 bg-gray-800 rounded-xl outline-none border-0 text-sm md:text-base"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.cus_email && (
            <span className="text-sm text-red-400">{errors.cus_email}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition text-sm md:text-base ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-xs text-center text-gray-400 pt-2">
          © 2025 JobPortal. All rights reserved.
        </div>
      </form>
    </div>
  );
};

export default CustomerForgotPassword;
