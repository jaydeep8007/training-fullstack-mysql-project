import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CustomerDataContext } from "../context/CustomerContext"; // ✅ Import the context

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState<{
    type: string;
    content: string | string[];
  }>({
    type: "",
    content: "",
  });

  // ✅ Use the context
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
         { withCredentials: true } // ✅ important for cookies
      );

      console.log("Login response:", response);

      if (response.status === 200) {
        // ✅ Extract accessToken and customer from nested response
        const token = response.data.data.accessToken;
        const customer = response.data.data.customer;
        console.log("Customer Data:", customer);

        // ✅ Save token to localStorage
        localStorage.setItem("accessToken", token);

        // ✅ Save customer to context
        updateCustomer(customer);

        // ✅ Redirect
        navigate("/customer-profile");
      }

      // setEmail("");
      // setPassword("");
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
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <form onSubmit={submitHandler}>
          <div>
            <h3 className="text-lg font-medium mb-2">What's your email</h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base"
              placeholder="example@email.com"
              type="email"
              required
            />

            <h3 className="text-lg font-medium mt-5">Enter password</h3>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base"
              placeholder="password"
              type="password"
              required
            />

            <button
              className="bg-[#111] text-white font-semibold mb-7 px-4 py-2 mt-8 rounded w-full text-lg"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mb-3 flex justify-center">
          New here?
          <Link className="text-blue-500 pl-2" to="/customer-signup">
            Create new Account
          </Link>
        </p>
      </div>

      {/* ✅ Success/Error Message */}
      {message.content && (
        <div className="flex justify-center">
          <div
            className={`text-sm font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            } text-center mt-2`}
          >
            {Array.isArray(message.content) ? (
              message.content.map((msg, idx) => <div key={idx}>• {msg}</div>)
            ) : (
              <div>{message.content}</div>
            )}
          </div>
        </div>
      )}

      <div>
        <Link
          to="/captain-login"
          className="flex justify-center bg-[#10b461] text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg"
        >
          Sign in as Employee
        </Link>
      </div>
    </div>
  );
};

export default CustomerLogin;
