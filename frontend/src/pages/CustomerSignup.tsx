import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { CustomerDataContext } from "../context/CustomerContext"; // ✅ Import

const CustomerSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState<{
    type: string;
    content: string | string[];
  }>({
    type: "",
    content: "",
  });

  const navigate = useNavigate();

  // ✅ Use context
  const { updateCustomer, setIsLoading, setError } = useContext(CustomerDataContext)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const customerData = {
      cus_firstname : firstname,
      cus_lastname : lastname,
      cus_email : email,
      cus_phone_number : phoneNumber,
      cus_password : password,
      cus_confirm_password : confirmPassword,
    };

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/customer/auth/signup`,
        customerData,
        { withCredentials: true } // ✅ important for cookies
      );

      if (response.status === 201 || response.status === 200) {
        const data = response.data;

        // ✅ Save customer in context
        updateCustomer(data.customer);

        setMessage({ type: "success", content: data.message });

        setTimeout(() => {
          navigate("/customer-profile");
        }, 1500);
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Signup failed!";
      const errors = errMsg.split(",").map((e: string) => e.trim());
      setMessage({ type: "error", content: errors[0] });
      setError(errors[0]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-screen flex flex-col justify-between">
      <div>
        <form onSubmit={handleSubmit}>
          {/* ... (all inputs same as before) */}
          <h3 className="text-base font-medium mb-1">What's Your Name?</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="bg-[#eeeeee] w-1/2 rounded px-3 py-2 border text-base placeholder:text-sm"
              type="text"
              placeholder="First name"
            />
            <input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="bg-[#eeeeee] w-1/2 rounded px-3 py-2 border text-base placeholder:text-sm"
              type="text"
              placeholder="Last name"
            />
          </div>

          <h3 className="text-base font-medium mb-1">Your Email</h3>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#eeeeee] mb-4 rounded px-3 py-2 border w-full text-base placeholder:text-sm"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-base font-medium mb-1">Phone Number</h3>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="bg-[#eeeeee] mb-4 rounded px-3 py-2 border w-full text-base placeholder:text-sm"
            type="tel"
            placeholder="Phone Number"
          />

          <h3 className="text-base font-medium mb-1">Password</h3>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#eeeeee] mb-4 rounded px-3 py-2 border w-full text-base placeholder:text-sm"
            type="password"
            placeholder="Password"
          />

          <h3 className="text-base font-medium mb-1">Confirm Password</h3>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-[#eeeeee] mb-6 rounded px-3 py-2 border w-full text-base placeholder:text-sm"
            type="password"
            placeholder="Confirm Password"
          />

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-2 rounded px-3 py-2 w-full text-base"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-base">
          Already have an account?{" "}
          <Link to="/customer-login" className="text-blue-600">
            Login here
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
        <p className="leading-4 text-gray-700 text-[10px]">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service</span> apply.
        </p>
      </div>
    </div>
  );
};

export default CustomerSignup;
