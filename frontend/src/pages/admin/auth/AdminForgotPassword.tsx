import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminForgotPassword = () => {
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
        `${import.meta.env.VITE_BASE_URL}/admin/auth/forget-password`,
        { admin_email: email }
      );

      toast.success(res.data.message || "Reset link sent!");
      navigate("/admin-login");
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
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-sm md:max-w-md p-6 bg-white text-gray-800 flex-col flex items-center gap-4 rounded-xl shadow-lg border border-gray-200"
      >
        <h2 className="text-lg md:text-lg font-semibold text-[#22345d]">
          Admin Password Reset
        </h2>
        <p className="text-xs md:text-sm text-gray-600 text-center">
          Enter your admin email to receive a reset link.
        </p>

        <div className="w-full flex flex-col gap-1 text-left">
          <label htmlFor="email" className="text-sm text-gray-600 font-medium">
            Admin Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none text-xs md:text-xs focus:ring-2 focus:ring-[#22345d]"
            placeholder="Enter your admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.admin_email && (
            <span className="text-sm text-red-500">{errors.admin_email}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#22345d] hover:bg-[#1a2a4c] text-white py-2 rounded-xl transition text-xs md:text-sm ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Send "}
        </button>

        <div className="text-xs text-center text-gray-400 pt-2">
          © 2025 JobPortal Admin. All rights reserved.
        </div>
      </form>
    </div>
  );
};

export default AdminForgotPassword;
