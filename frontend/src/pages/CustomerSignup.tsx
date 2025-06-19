import React, { useState } from "react";
import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

const CustomerSignup = () => {
  const [cus_firstname, setFirstname] = useState("");
  const [cus_lastname, setLastname] = useState("");
  const [cus_email, setEmail] = useState("");
  const [cus_phone_number, setPhoneNumber] = useState("");
  const [cus_password, setPassword] = useState("");
  const [cus_confirm_password, setConfirmPassword] = useState("");

  const [message, setMessage] = useState<{
    type: string;
    content: string | string[];
  }>({
    type: "",
    content: "",
  });

  // const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const customerData = {
      cus_firstname,
      cus_lastname,
      cus_email,
      cus_phone_number,
      cus_password,
      cus_confirm_password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/customer/auth/signup`,
        customerData
      );

      if (response.status === 201 || response.status === 200) {
        console.log("✅ Signup Success:", response.data);
        setMessage({ type: "success", content: response.data.message });
     
        // setTimeout(() => {
        //   navigate("/profile"); // or whatever your next route is
        // }, 1500);
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Signup failed!";

      // Split message by commas (and trim each part)
      const errors = errMsg.split(",").map((e: string) => e.trim());

      // Just show the first one
      setMessage({ type: "error", content: errors[0] });
    }
  };

  return (
    <div className="p-4 h-screen flex flex-col justify-between">
      <div>
        <form onSubmit={handleSubmit}>
          <h3 className="text-base font-medium mb-1">What's Your Name?</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={cus_firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="bg-[#eeeeee] w-1/2 rounded px-3 py-2 border text-base placeholder:text-sm"
              type="text"
              placeholder="First name"
            />
            <input
              value={cus_lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="bg-[#eeeeee] w-1/2 rounded px-3 py-2 border text-base placeholder:text-sm"
              type="text"
              placeholder="Last name"
            />
          </div>

          <h3 className="text-base font-medium mb-1">Your Email</h3>
          <input
            value={cus_email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#eeeeee] mb-4 rounded px-3 py-2 border w-full text-base placeholder:text-sm"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-base font-medium mb-1">Phone Number</h3>
          <input
            value={cus_phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="bg-[#eeeeee] mb-4 rounded px-3 py-2 border w-full text-base placeholder:text-sm"
            type="tel"
            placeholder="Phone Number"
          />

          <h3 className="text-base font-medium mb-1">Password</h3>
          <input
            value={cus_password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#eeeeee] mb-4 rounded px-3 py-2 border w-full text-base placeholder:text-sm"
            type="password"
            placeholder="Password"
          />

          <h3 className="text-base font-medium mb-1">Confirm Password</h3>
          <input
            value={cus_confirm_password}
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
          {/* <Link to="/customer-login" className="text-blue-600">
            Login here
          </Link> */}
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
