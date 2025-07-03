import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const CustomerResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/customer/auth/reset-password`,
        {
          reset_token: token,
          new_password: password,
          confirm_password: confirmPassword,
        }
      );

      toast.success(res.data.message || "Password reset successful!");
      navigate("/customer-login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4">
      <form
        onSubmit={handleReset}
        className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-6 bg-gray-900 text-white flex flex-col gap-4 rounded-xl shadow-slate-700 shadow-xl"
      >
        <h2 className="text-lg md:text-xl font-semibold text-center">
          Reset Password
        </h2>

        {/* New Password Field */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full px-4 py-3 bg-gray-800 rounded-xl outline-none border-0 text-sm md:text-base pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 bg-gray-800 rounded-xl outline-none border-0 text-sm md:text-base pr-12"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-400 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition text-sm md:text-base"
        >
          Reset Password
        </button>

        <div className="text-xs text-center text-gray-400 pt-2">
          © 2025 JobPortal. All rights reserved.
        </div>
      </form>
    </div>
  );
};

export default CustomerResetPassword;
