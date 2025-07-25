// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// const AdminResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!token) {
//       toast.error("Invalid or missing token.");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/admin/auth/reset-password`,
//         {
//           reset_token: token,
//           new_password: password,
//           confirm_password: confirmPassword,
//         }
//       );

//       toast.success(res.data.message || "Password reset successful!");
//       navigate("/admin-login");
//     } catch (error: any) {
//       const backendErrors = error?.response?.data?.errors;

//       if (Array.isArray(backendErrors)) {
//         const fieldErrors: Record<string, string> = {};
//         for (const err of backendErrors) {
//           if (err.path && err.message) {
//             fieldErrors[err.path[0]] = err.message;
//           }
//         }
//         setErrors(fieldErrors);
//       } else {
//         toast.error(error?.response?.data?.message || "Reset failed");
//       }
//     }
//   };

//   return (
//     <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f172a] px-4">
//       <form
//         onSubmit={handleReset}
//         className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-6 bg-gray-900 text-white flex flex-col gap-4 rounded-xl shadow-slate-700 shadow-xl"
//       >
//         <h2 className="text-lg md:text-xl font-semibold text-center">
//           Admin Password Reset
//         </h2>

//         {/* New Password Field */}
//         <div className="relative flex flex-col gap-1">
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter new password"
//             className="w-full px-4 py-3 bg-gray-800 rounded-xl outline-none border-0 text-sm md:text-base pr-12"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <div
//             className="absolute right-4 top-3.5 text-xl text-gray-400 cursor-pointer"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? <FiEyeOff /> : <FiEye />}
//           </div>
//           {errors.new_password && (
//             <span className="text-sm text-red-400">{errors.new_password}</span>
//           )}
//         </div>

//         {/* Confirm Password Field */}
//         <div className="relative flex flex-col gap-1">
//           <input
//             type={showConfirmPassword ? "text" : "password"}
//             placeholder="Confirm new password"
//             className="w-full px-4 py-3 bg-gray-800 rounded-xl outline-none border-0 text-sm md:text-base pr-12"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//           <div
//             className="absolute right-4 top-3.5 text-xl text-gray-400 cursor-pointer"
//             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//           >
//             {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
//           </div>
//           {errors.confirm_password && (
//             <span className="text-sm text-red-400">{errors.confirm_password}</span>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition text-sm md:text-base"
//         >
//           Reset Password
//         </button>

//         <div className="text-xs text-center text-gray-400 pt-2">
//           © 2025 JobPortal Admin. All rights reserved.
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AdminResetPassword;


import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AdminResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/auth/reset-password`,
        {
          reset_token: token,
          new_password: password,
          confirm_password: confirmPassword,
        }
      );

      toast.success(res.data.message || "Password reset successful!");
      navigate("/admin-login");
    } catch (error: any) {
      const backendErrors = error?.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const fieldErrors: Record<string, string> = {};
        for (const err of backendErrors) {
          if (err.path && err.message) {
            fieldErrors[err.path[0]] = err.message;
          }
        }
        setErrors(fieldErrors);
      } else {
        toast.error(error?.response?.data?.message || "Reset failed");
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleReset}
        className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-6 bg-white text-gray-800 flex flex-col gap-4 rounded-xl shadow-lg border border-gray-200"
      >
        <h2 className="text-lg md:text-lg font-semibold text-[#22345d] text-center">
          Admin Password
        </h2>

        {/* New Password Field */}
        <div className="relative flex flex-col gap-1 text-left">
          <label htmlFor="new-password" className="text-sm text-gray-600 font-medium">
            New Password
          </label>
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none text-xs md:text-sm pr-10 focus:ring-2 focus:ring-[#22345d]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute right-4 top-[38px] text-lg text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
          {errors.new_password && (
            <span className="text-sm text-red-500">{errors.new_password}</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="relative flex flex-col gap-1 text-left">
          <label htmlFor="confirm-password" className="text-sm text-gray-600 font-medium">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none text-xs md:text-sm pr-10 focus:ring-2 focus:ring-[#22345d]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div
            className="absolute right-4 top-[38px] text-lg text-gray-500 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </div>
          {errors.confirm_password && (
            <span className="text-sm text-red-500">{errors.confirm_password}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#22345d] hover:bg-[#1a2a4c] text-white py-2 rounded-xl transition text-xs md:text-sm"
        >
          Reset 
        </button>

        <div className="text-xs text-center text-gray-400 pt-2">
          © 2025 JobPortal Admin. All rights reserved.
        </div>
      </form>
    </div>
  );
};

export default AdminResetPassword;
