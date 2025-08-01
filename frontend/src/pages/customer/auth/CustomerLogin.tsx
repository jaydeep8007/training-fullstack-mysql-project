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
  <div
    className="w-full h-screen flex items-center justify-center bg-cover bg-center px-4"
    style={{ backgroundImage: "url('/background.jpg')" }}
  >
    <form
      onSubmit={submitHandler}
      className="w-full max-w-md p-6 bg-slate-200/50 rounded-xl shadow-md space-y-6"
    >
      <h1 className="text-xl font-semibold text-center text-gray-700">Customer Login</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email Address</label>
          <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:border-blue-700 transition-colors duration-200 ease-out">
            <MdAlternateEmail className="text-gray-400 mr-2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full outline-none text-xs text-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white relative hover:border-blue-700 transition-colors duration-200 ease-out">
            <FaFingerprint className="text-gray-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full outline-none text-xs text-gray-800"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-3 cursor-pointer text-gray-500 hover:text-blue-700 transition-colors duration-200 ease-out"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-3 cursor-pointer text-gray-500 hover:text-blue-700 transition-colors duration-200 ease-out"
                onClick={togglePasswordView}
              />
            )}
          </div>
        </div>

        <div className="text-right text-sm text-blue-600 hover:underline">
          <Link to="/customer-forget-password">Forgot Password?</Link>
        </div>

        {message.content && (
          <div className="text-sm text-red-500 text-center">
            {Array.isArray(message.content) ? (
              message.content.map((msg, i) => <div key={i}>• {msg}</div>)
            ) : (
              <div>{message.content}</div>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition text-sm"
      >
        Login
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/customer-signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>

      <div className="relative w-full flex items-center justify-center py-3">
        <div className="w-2/5 h-[2px] bg-gray-300"></div>
        <h3 className="text-xs px-4 text-gray-500">Or</h3>
        <div className="w-2/5 h-[2px] bg-gray-300"></div>
      </div>

      <div className="w-full flex items-center justify-evenly gap-2">
        <div className="p-2 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
          <BsApple className="text-white text-lg md:text-xl" />
        </div>
        <div className="p-2 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
          <img src="/google-logo.png" alt="google" className="w-6 md:w-8" />
        </div>
        <div className="p-2 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
          <FaXTwitter className="text-white text-lg md:text-xl" />
        </div>
      </div>

      <Link
        to="/admin-login"
        className="block w-full text-center mt-2 py-2 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition"
      >
        Sign in as Admin
      </Link>
    </form>
  </div>
);

};

export default CustomerLogin;
