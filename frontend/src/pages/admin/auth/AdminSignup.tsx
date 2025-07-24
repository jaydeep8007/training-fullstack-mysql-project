// import React, { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AdminDataContext } from "@/context/AdminContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//   MdAlternateEmail,
//   MdOutlinePhoneAndroid,
//   MdOutlineDriveFileRenameOutline,
// } from "react-icons/md";
// import { FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

// const AdminSignup = () => {
//   const [firstname, setFirstname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [email, setEmail] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [roleId, setRoleId] = useState("");


//   const togglePassword = () => setShowPassword(!showPassword);
//   const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

//   const navigate = useNavigate();
//   const {  admin: currentAdmin, updateAdmin, setIsLoading, isLoading, setError } = useContext(AdminDataContext)!;

//   const [message, setMessage] = useState<{ type: string; content: string | string[] }>({
//     type: "",
//     content: "",
//   });

//   if (currentAdmin?.role_id === 1 && !roleId) {
//   setMessage({ type: "error", content: "Please select a role for the admin." });
//   return;
// }
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const adminData = {
//       admin_firstname: firstname,
//       admin_lastname: lastname,
//       admin_email: email,
//       admin_phone_number: phoneNumber,
//       admin_password: password,
//       admin_confirm_password: confirmPassword,

//     };

//     try {
//       setIsLoading(true);

//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/admin/auth/signup`,
//         adminData,
//         { withCredentials: true }
//       );

//       if (response.status === 201 || response.status === 200) {
//         const data = response.data;

//         // ✅ Save access token & update context
//         localStorage.setItem("adminAccessToken", data.data.accessToken);
//         updateAdmin(data.data.admin);

//         toast.success("Signup successful! 🎉");
//         setTimeout(() => navigate("/admin/dashboard"), 100);
//       }
//     } catch (error: any) {
//       const errMsg = error?.response?.data?.message || "Signup failed!";
//       const errors = errMsg.split(",").map((e: string) => e.trim());
//       setMessage({ type: "error", content: errors[0] });
//       setError(errors[0]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="w-[90%] max-w-sm md:max-w-md p-6 bg-gray-900 text-white flex flex-col gap-4 rounded-xl shadow-lg shadow-purple-700"
//       >
//         <h2 className="text-xl font-bold text-center">Admin Registration</h2>

//         <div className="flex gap-2">
//           <div className="w-1/2 flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
//             <MdOutlineDriveFileRenameOutline />
//             <input
//               type="text"
//               placeholder="First Name"
//               value={firstname}
//               onChange={(e) => setFirstname(e.target.value)}
//               required
//               className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
//             />
//           </div>
//           <div className="w-1/2 flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
//             <MdOutlineDriveFileRenameOutline />
//             <input
//               type="text"
//               placeholder="Last Name"
//               value={lastname}
//               onChange={(e) => setLastname(e.target.value)}
//               required
//               className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
//           <MdAlternateEmail />
//           <input
//             type="email"
//             placeholder="Email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
//           />
//         </div>

//         <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
//           <MdOutlinePhoneAndroid />
//           <input
//             type="tel"
//             placeholder="Phone Number"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//             className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
//           />
//         </div>

//         <div className="relative flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
//           <FaLock />
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
//           />
//           {showPassword ? (
//             <FaRegEyeSlash className="absolute right-4 cursor-pointer" onClick={togglePassword} />
//           ) : (
//             <FaRegEye className="absolute right-4 cursor-pointer" onClick={togglePassword} />
//           )}
//         </div>

//         <div className="relative flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
//           <FaLock />
//           <input
//             type={showConfirmPassword ? "text" : "password"}
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400"
//           />
//           {showConfirmPassword ? (
//             <FaRegEyeSlash
//               className="absolute right-4 cursor-pointer"
//               onClick={toggleConfirmPassword}
//             />
//           ) : (
//             <FaRegEye
//               className="absolute right-4 cursor-pointer"
//               onClick={toggleConfirmPassword}
//             />
//           )}
//         </div>
        
//   {/* <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
//     <select
//       value={roleId}
//       onChange={(e) => setRoleId(e.target.value)}
//       required
//       className="bg-transparent border-0 outline-none w-full text-sm placeholder-gray-400 text-white"
//     >
//       <option value="" disabled>-- Select Role --</option>
//       <option value="1">Super Admin</option>
//       <option value="2">Sub Admin</option>
//     </select>
//   </div> */}



//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full font-semibold py-2 rounded-xl text-sm md:text-base ${
//             isLoading
//               ? "bg-gray-500 cursor-not-allowed"
//               : "bg-purple-600 hover:bg-purple-700 text-white"
//           }`}
//         >
//           {isLoading ? "Registering..." : "Register as Admin"}
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

//         <p className="text-sm text-gray-400 text-center">
//           Already registered?{" "}
//           <Link to="/admin-login" className="text-white underline">
//             Login here
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default AdminSignup;


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
  const [roleId, setRoleId] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const navigate = useNavigate();
  const {
    admin: currentAdmin,
    updateAdmin,
    setIsLoading,
    isLoading,
    setError,
  } = useContext(AdminDataContext)!;

  const [message, setMessage] = useState<{ type: string; content: string | string[] }>({
    type: "",
    content: "",
  });

  if (currentAdmin?.role_id === 1 && !roleId) {
    setMessage({ type: "error", content: "Please select a role for the admin." });
    return;
  }

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

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
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
   <div
  className="w-full h-screen flex items-center justify-center bg-cover bg-center px-4"
  style={{ backgroundImage: "url('/background.jpg')" }}
>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-blue-300/50 text-gray-700 flex flex-col gap-4 rounded-xl shadow-md border border-blue-200"
      >
        <h2 className="text-xl font-bold text-center text-[#22345d]">Admin Registration</h2>

        {/* First + Last Name */}
<div className="flex gap-2">
  <div className="w-1/2">
    <label className="text-sm font-medium text-gray-600 block mb-1">First Name</label>
   <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-xl border border-blue-300 hover:border-[#22345d] transition-colors duration-200 ease-out">
      <MdOutlineDriveFileRenameOutline className="text-gray-500" />
      <input
        type="text"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        required
        className="bg-transparent border-0 outline-none w-full text-xs placeholder-gray-400"
        placeholder="First Name"
      />
    </div>
  </div>
  <div className="w-1/2">
    <label className="text-sm font-medium text-gray-600 block mb-1">Last Name</label>
    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-300 hover:border-[#22345d] transition-colors duration-200 ease-out">
      <MdOutlineDriveFileRenameOutline className="text-gray-500" />
      <input
        type="text"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        required
        className="bg-transparent border-0 outline-none w-full text-xs placeholder-gray-400"
        placeholder="Last Name"
      />
    </div>
  </div>
</div>

{/* Email */}
<div>
  <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
 <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-300 hover:border-[#22345d] transition-colors duration-200 ease-out">
    <MdAlternateEmail className="text-gray-500" />
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="bg-transparent border-0 outline-none w-full text-xs placeholder-gray-400"
      placeholder="Email address"
    />
  </div>
</div>

{/* Phone Number */}
<div>
  <label className="text-sm font-medium text-gray-600 block mb-1">Phone Number</label>
 <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-300 hover:border-[#22345d] transition-colors duration-200 ease-out">
    <MdOutlinePhoneAndroid className="text-gray-500" />
    <input
      type="tel"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      required
      className="bg-transparent border-0 outline-none w-full text-xs placeholder-gray-400"
      placeholder="Phone Number"
    />
  </div>
</div>

{/* Password */}
<div>
  <label className="text-sm font-medium text-gray-600 block mb-1">Password</label>
  <div className="relative flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-300 hover:border-[#22345d] transition-colors duration-200 ease-out">
    <FaLock className="text-gray-500" />
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="bg-transparent border-0 outline-none w-full text-xs placeholder-gray-400"
      placeholder="Password"
    />
    {showPassword ? (
      <FaRegEyeSlash className="absolute right-4 text-gray-400 cursor-pointer  hover:text-[#22345d] transition-colors duration-200 ease-out" onClick={togglePassword} />
    ) : (
      <FaRegEye className="absolute right-4 text-gray-400 cursor-pointer  hover:text-[#22345d] transition-colors duration-200 ease-out" onClick={togglePassword} />
    )}
  </div>
</div>

{/* Confirm Password */}
<div>
  <label className="text-sm font-medium text-gray-600 block mb-1">Confirm Password</label>
  <div className="relative flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-300 hover:border-[#22345d] transition-colors duration-200 ease-out">
    <FaLock className="text-gray-500" />
    <input
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
      className="bg-transparent border-0 outline-none w-full text-xs placeholder-gray-400"
      placeholder="Confirm Password"
    />
    {showConfirmPassword ? (
      <FaRegEyeSlash className="absolute right-4 text-gray-400 cursor-pointer hover:text-[#22345d] transition-colors duration-200 ease-out" onClick={toggleConfirmPassword} />
    ) : (
      <FaRegEye className="absolute right-4 text-gray-400 hover  cursor-pointer hover:text-[#22345d] transition-colors duration-200 ease-out" onClick={toggleConfirmPassword} />
    )}
  </div>
</div>

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full  py-2 rounded-xl text-xs md:text-sm transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#22345d] hover:bg-[#1b2a48] text-white"
          }`}
        >
          {isLoading ? "Registering..." : "Register "}
        </button>

        {/* Error Message */}
        {message.content && (
          <div className="text-center text-sm text-red-600 mt-1">
            {Array.isArray(message.content) ? (
              message.content.map((msg, i) => <div key={i}>• {msg}</div>)
            ) : (
              <div>{message.content}</div>
            )}
          </div>
        )}

        {/* Footer Text */}
        <p className="text-sm text-gray-600 text-center">
          Already registered?{" "}
          <Link to="/admin-login" className="text-[#22345d] hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminSignup;
