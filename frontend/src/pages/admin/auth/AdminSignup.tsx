import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminDataContext } from "@/context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MdAlternateEmail,
  MdOutlinePhoneAndroid,
  MdOutlineDriveFileRenameOutline,
} from "react-icons/md";
import { FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const AdminSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const navigate = useNavigate();
  const { updateAdmin, setIsLoading, isLoading, setError } = useContext(AdminDataContext)!;

  const [message, setMessage] = useState<{ type: string; content: string | string[] }>({
    type: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const adminData = {
      admin_firstname: firstname,
      admin_lastname: lastname,
      admin_email: email,
      admin_phone_number: phoneNumber,
      admin_password: password,
      admin_confirm_password: confirmPassword,
    };

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/auth/signup`,
        adminData,
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        const data = response.data;

        // ✅ Save access token & update context
        localStorage.setItem("adminAccessToken", data.data.accessToken);
        updateAdmin(data.data.admin);

        toast.success("Signup successful! 🎉");
        setTimeout(() => navigate("/admin/dashboard"), 100);
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
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-sm md:max-w-md p-6 bg-gray-900 text-white flex flex-col gap-4 rounded-xl shadow-lg shadow-purple-700"
      >
        <h2 className="text-xl font-bold text-center">Admin Registration</h2>

        <div className="flex gap-2">
          <div className="w-1/2 flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
            <MdOutlineDriveFileRenameOutline />
            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
            />
          </div>
          <div className="w-1/2 flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
            <MdOutlineDriveFileRenameOutline />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
          <MdAlternateEmail />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
          <MdOutlinePhoneAndroid />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
          />
        </div>

        <div className="relative flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
          <FaLock />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
          />
          {showPassword ? (
            <FaRegEyeSlash className="absolute right-4 cursor-pointer" onClick={togglePassword} />
          ) : (
            <FaRegEye className="absolute right-4 cursor-pointer" onClick={togglePassword} />
          )}
        </div>

        <div className="relative flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
          <FaLock />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
          />
          {showConfirmPassword ? (
            <FaRegEyeSlash
              className="absolute right-4 cursor-pointer"
              onClick={toggleConfirmPassword}
            />
          ) : (
            <FaRegEye
              className="absolute right-4 cursor-pointer"
              onClick={toggleConfirmPassword}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-semibold py-2 rounded-xl text-sm md:text-base ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {isLoading ? "Registering..." : "Register as Admin"}
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

        <p className="text-sm text-gray-400 text-center">
          Already registered?{" "}
          <Link to="/admin-login" className="text-white underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminSignup;
