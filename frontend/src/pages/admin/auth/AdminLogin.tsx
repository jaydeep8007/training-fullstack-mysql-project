// import React, { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AdminDataContext } from "@/context/AdminContext";
// import { toast } from "react-toastify";

// // Icons
// import { MdAlternateEmail } from "react-icons/md";
// import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
// import { BsApple } from "react-icons/bs";
// import { FaXTwitter } from "react-icons/fa6";

// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const togglePasswordView = () => setShowPassword(!showPassword);

//   const navigate = useNavigate();
//   const { updateAdmin, setIsLoading, setError } = useContext(AdminDataContext)!;

//   const [message, setMessage] = useState<{ type: string; content: string | string[] }>({
//     type: "",
//     content: "",
//   });

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const adminData = {
//       admin_email: email,
//       admin_password: password,
//     };

//     try {
//       setIsLoading(true);

//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/admin/auth/login`,
//         adminData,
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         const token = response.data.data.accessToken;
//         const admin = response.data.data.admin;
//         localStorage.setItem("adminAccessToken", token);
//         updateAdmin(admin);

//         toast.success("Signin successful! 🎉");

//         setTimeout(() => {
//           navigate("/admin/dashboard");
//         }, 100);
//       }
//     } catch (error: any) {
//       const errMsg = error?.response?.data?.message || "Login failed!";
//       const errors = errMsg.split(",").map((e: string) => e.trim());
//       setMessage({ type: "error", content: errors[0] });
//       setError(errors[0]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4">
//       <form
//         onSubmit={submitHandler}
//         className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-6 bg-gray-900 text-white flex-col flex items-center gap-4 rounded-xl shadow-blue-200 shadow-xl"
//       >
//         <h1 className="text-lg md:text-xl font-semibold">Welcome Admin</h1>
//         <p className="text-xs md:text-sm text-gray-400 text-center">
//           Don't have an account?{" "}
//           <Link to="/admin-signup" className="text-white underline">
//             Register
//           </Link>
//         </p>

//         <div className="w-full flex flex-col gap-3">
//           <div className="w-full flex items-center gap-2 bg-gray-800 p-3 rounded-xl">
//             <MdAlternateEmail className="text-lg" />
//             <input
//               type="email"
//               placeholder="Email address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
//             />
//           </div>

//           <div className="w-full flex items-center gap-2 bg-gray-800 p-3 rounded-xl relative">
//             <FaFingerprint className="text-lg" />
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
//             />
//             {showPassword ? (
//               <FaRegEyeSlash
//                 className="absolute right-5 cursor-pointer"
//                 onClick={togglePasswordView}
//               />
//             ) : (
//               <FaRegEye
//                 className="absolute right-5 cursor-pointer"
//                 onClick={togglePasswordView}
//               />
//             )}
//           </div>

//           <div className="w-full text-right text-xs text-blue-400 hover:underline">
//             <Link to="/admin-forgot-password">Forgot Password?</Link>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full p-2 bg-purple-600 rounded-xl mt-1 hover:bg-purple-700 text-sm md:text-base transition"
//         >
//           Login
//         </button>

//         {message.content && (
//           <div className="text-center text-sm text-red-500 mt-1">
//             {Array.isArray(message.content) ? (
//               message.content.map((msg, i) => <div key={i}>• {msg}</div>)
//             ) : (
//               <div>{message.content}</div>
//             )}
//           </div>
//         )}

//         <div className="relative w-full flex items-center justify-center py-3">
//           <div className="w-2/5 h-[2px] bg-gray-800"></div>
//           <h3 className="font-lora text-xs md:text-sm px-4 text-gray-500">Or</h3>
//           <div className="w-2/5 h-[2px] bg-gray-800"></div>
//         </div>

//         <div className="w-full flex items-center justify-evenly md:justify-between gap-2">
//           <div className="p-2 md:px-6 lg:px-8 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
//             <BsApple className="text-lg md:text-xl" />
//           </div>
//           <div className="p-1 md:px-6 lg:px-8 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
//             <img src="/google-logo.png" alt="google" className="w-6 md:w-8" />
//           </div>
//           <div className="p-2 md:px-6 lg:px-8 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
//             <FaXTwitter className="text-lg md:text-xl" />
//           </div>
//         </div>

//         <Link
//           to="/customer-login"
//           className="w-full mt-4 p-2 text-center text-sm bg-blue-600 hover:bg-blue-700 rounded-xl transition"
//         >
//           Sign in as Customer
//         </Link>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminDataContext } from "@/context/AdminContext";
import { toast } from "react-toastify";

import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordView = () => setShowPassword(!showPassword);

  const navigate = useNavigate();
  const { updateAdmin, setIsLoading, setError } = useContext(AdminDataContext)!;

  const [message, setMessage] = useState<{ type: string; content: string | string[] }>({
    type: "",
    content: "",
  });

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const adminData = {
      admin_email: email,
      admin_password: password,
    };

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/auth/login`,
        adminData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const token = response.data.data.accessToken;
        const admin = response.data.data.admin;
        localStorage.setItem("adminAccessToken", token);
        updateAdmin(admin);

        toast.success("Signin successful! 🎉");

        setTimeout(() => {
          navigate("/admin/dashboard");
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
        <h1 className="text-xl font-semibold text-center text-gray-700">Admin Login</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm  text-gray-600 mb-1">Email Address</label>
            <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:border-[#22345d] transition-colors duration-200 ease-out">
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
            <label className="block text-sm  text-gray-600 mb-1">Password</label>
            <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white relative hover:border-[#22345d] transition-colors duration-200 ease-out">
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
                  className="absolute right-3 cursor-pointer text-gray-500  hover:text-[#22345d] transition-colors duration-200 ease-out"
                  onClick={togglePasswordView}
                />
              ) : (
                <FaRegEye
                  className="absolute right-3 cursor-pointer text-gray-500  hover:text-[#22345d] transition-colors duration-200 ease-out"
                  onClick={togglePasswordView}
                />
              )}
            </div>
          </div>

          <div className="text-right text-sm text-blue-600 hover:underline">
            <Link to="/admin-forgot-password">Forgot Password?</Link>
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
          className="w-full py-2 px-4 bg-[#22345d] hover:bg-[#1b2a4c] text-white rounded-md transition text-sm"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/admin-signup" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>

        <Link
          to="/customer-login"
          className="block w-full text-center mt-2 py-2 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition"
        >
          Sign in as Customer
        </Link>
      </form>
    </div>
  );
};

export default AdminLogin;
