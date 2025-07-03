import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CustomerDataContext } from "../../../context/CustomerContext";
import { toast } from "react-toastify";

// Icons
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { BsApple } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordView = () => setShowPassword(!showPassword);

  const navigate = useNavigate();
  const [message, setMessage] = useState<{
    type: string;
    content: string | string[];
  }>({
    type: "",
    content: "",
  });

  const { updateCustomer, setIsLoading, setError } =
    useContext(CustomerDataContext)!;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const customerData = {
      cus_email: email,
      cus_password: password,
    };

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/customer/auth/login`,
        customerData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const token = response.data.data.accessToken;
        const customer = response.data.data.customer;
        localStorage.setItem("customerAccessToken", token);
        updateCustomer(customer);

        toast.success("Signin successful! 🎉");

        setTimeout(() => {
          navigate("/customer-home");
        }, 100);
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Login failed!";
      const errors = errMsg.split(",").map((e: string) => e.trim());
      setMessage({ type: "error", content: errors[0] });
      setError(errors[0]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4">
      <form
        onSubmit={submitHandler}
        className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-6 bg-gray-900 text-white flex-col flex items-center gap-4 rounded-xl shadow-slate-700 shadow-xl"
      >
        <h1 className="text-lg md:text-xl font-semibold">Welcome Back</h1>
        <p className="text-xs md:text-sm text-gray-400 text-center">
          Don't have an account?{" "}
          <Link to="/customer-signup" className="text-white underline">
            Sign up
          </Link>
        </p>

        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center gap-2 bg-gray-800 p-3 rounded-xl">
            <MdAlternateEmail className="text-lg" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-800 p-3 rounded-xl relative">
            <FaFingerprint className="text-lg" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>

          {/* ✅ Forgot Password Link */}
          <div className="w-full text-right text-xs text-blue-400 hover:underline">
            <Link to="/customer-forget-password">Forgot Password?</Link>
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 rounded-xl mt-1 hover:bg-blue-600 text-sm md:text-base transition"
        >
          Login
        </button>

        {message.content && (
          <div className="text-center text-sm text-red-500 mt-1">
            {Array.isArray(message.content) ? (
              message.content.map((msg, i) => <div key={i}>• {msg}</div>)
            ) : (
              <div>{message.content}</div>
            )}
          </div>
        )}

        <div className="relative w-full flex items-center justify-center py-3">
          <div className="w-2/5 h-[2px] bg-gray-800"></div>
          <h3 className="font-lora text-xs md:text-sm px-4 text-gray-500">
            Or
          </h3>
          <div className="w-2/5 h-[2px] bg-gray-800"></div>
        </div>

        <div className="w-full flex items-center justify-evenly md:justify-between gap-2">
          <div className="p-2 md:px-6 lg:px-8 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
            <BsApple className="text-lg md:text-xl" />
          </div>
          <div className="p-1 md:px-6 lg:px-8 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
            <img src="/google-logo.png" alt="google" className="w-6 md:w-8" />
          </div>
          <div className="p-2 md:px-6 lg:px-8 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
            <FaXTwitter className="text-lg md:text-xl" />
          </div>
        </div>

        <Link
          to="/admin-login"
          className="w-full mt-4 p-2 text-center text-sm bg-purple-600 hover:bg-purple-700 rounded-xl transition"
        >
          Sign in as Admin
        </Link>
      </form>
    </div>
  );
};

export default CustomerLogin;
