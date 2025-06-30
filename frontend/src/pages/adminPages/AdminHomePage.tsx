import { useEffect, useContext, useState, useRef } from "react";
import { AdminDataContext } from "@/context/AdminContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const AdminHome = () => {
  const navigate = useNavigate();
  const {
    admin,
    updateAdmin,
    setIsLoading,
    setError,
    isLoading,
  } = useContext(AdminDataContext)!;

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("adminAccessToken");
        if (!token) throw new Error("Missing token");

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        updateAdmin(response.data.data.admin);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError("Session expired. Please login again.");
        navigate("/admin-login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminAccessToken");

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      updateAdmin(null);
      localStorage.removeItem("adminAccessToken");
      toast.success("Logout successful! 🎉");
      navigate("/admin-login");
    } catch (error: any) {
      console.error("Logout error:", error);
      const errMsg = error?.response?.data?.message || "Logout failed";
      setError(errMsg);
      alert(errMsg);
    }
  };

  return (
   <div className="min-h-screen bg-gray-100 text-gray-800 font-sans text-sm">
  {/* Loading */}
  {isLoading && (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="text-blue-600 text-lg font-semibold">Loading...</div>
    </div>
  )}

  {/* Sidebar Overlay */}
  <div
    className={`fixed inset-0 bg-black bg-opacity-20 z-40 ${
      sidebarOpen ? "block" : "hidden"
    }`}
    onClick={() => setSidebarOpen(false)}
  />

  {/* Sidebar */}
  <div
    className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <div className="flex justify-between items-center px-4 py-4 border-b border-gray-300">
      <h2 className="text-lg font-bold">Admin Panel</h2>
      <FiX className="cursor-pointer" size={24} onClick={() => setSidebarOpen(false)} />
    </div>
    <nav className="flex flex-col gap-3 p-4 text-sm">
      {[
        ["Dashboard", "/admin-home"],
        ["Settings", "/admin-settings"],
        ["Manage Customers", "/manage-customers"],
        ["Manage Employees", "/manage-employees"],
        ["Manage Jobs", "/manage-jobs"],
        ["Job Assignments", "/assignments"],
        ["Reports", "/admin-reports"],
      ].map(([label, route]) => (
        <button
          key={label}
          onClick={() => navigate(route)}
          className="text-left hover:text-blue-500"
        >
          {label}
        </button>
      ))}
    </nav>
  </div>

  {/* Navbar */}
  <header className="bg-white shadow px-6 py-3 flex items-center justify-between relative">
    <div className="flex items-center gap-6">
      <FiMenu className="cursor-pointer text-gray-700" size={24} onClick={() => setSidebarOpen(true)} />
      <h1 className="text-lg font-bold tracking-tight text-blue-600">Admin Dashboard</h1>
    </div>

    <div className="relative">
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex gap-4 text-sm">
          <button onClick={() => navigate("/admin-about")} className="text-gray-600 hover:text-blue-500">About Us</button>
          <button onClick={() => navigate("/admin-contact")} className="text-gray-600 hover:text-blue-500">Contact</button>
        </nav>
        <FaUserCircle
          className="w-7 h-7 cursor-pointer text-gray-700"
          onClick={() => setShowDropdown(!showDropdown)}
        />
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md text-sm z-50"
        >
          {[
            ["View Profile", "/admin-profile"],
            ["Account Settings", "/admin-account-settings"],
            ["Notifications", "/admin-notifications"],
            ["Help & Support", "/admin-help"],
          ].map(([label, route]) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setOpenLogoutDialog(true)}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </header>

  {/* Main */}
  <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Left Section */}
    <div className="lg:col-span-2 space-y-6">
      {/* Welcome Box */}
      <div className="bg-white border p-4 rounded shadow">
        <h2 className="text-base font-semibold mb-2">Welcome, {admin?.admin_firstname || "Admin"}!</h2>
        <p className="text-gray-600">
          Manage customers, employees, and job assignments from one place.
        </p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition active:scale-95"
          onClick={() => navigate("/admin-profile")}
        >
          View Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 border border-blue-300 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-blue-800">Total Customers</h3>
          <p className="text-2xl mt-1 font-bold text-blue-600">124</p>
        </div>
        <div className="bg-green-100 border border-green-300 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-green-800">Total Employees</h3>
          <p className="text-2xl mt-1 font-bold text-green-600">58</p>
        </div>
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-yellow-800">Active Jobs</h3>
          <p className="text-2xl mt-1 font-bold text-yellow-600">35</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Top Applicants", "Recent Job Posts"].map((title, index) => (
          <div key={index} className="bg-white border p-4 rounded shadow">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
            <p className="text-xs text-gray-500">Sample content for {title.toLowerCase()} section.</p>
          </div>
        ))}
      </div>

      {/* Activities */}
      <div className="bg-white border p-4 rounded shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Activities</h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>🛠 Job "Frontend Developer" updated 1 hour ago.</li>
          <li>👤 New customer registered: John Doe</li>
          <li>📤 Employee assignment updated</li>
        </ul>
      </div>
    </div>

    {/* Right Sidebar */}
    <div className="space-y-4">
      <div className="bg-white border p-4 rounded shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Admin Notifications</h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>🔔 New employee registered</li>
          <li>📩 3 job applications pending</li>
          <li>⚠️ Profile update required</li>
        </ul>
      </div>

      <div className="bg-white border p-4 rounded shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Actions</h4>
        <button className="w-full mb-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Job</button>
        <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Employee</button>
      </div>

      <div className="bg-white border p-4 rounded shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Employees</h4>
        <div className="space-y-2 text-xs text-gray-600">
          {[1, 2, 3].map((id) => (
            <div key={id} className="flex justify-between">
              <span>👩‍💼 Jane Doe #{id}</span>
              <span className="text-green-600">Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>

  {/* Logout Modal */}
  {openLogoutDialog && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-[90%] max-w-sm shadow-lg text-sm">
        <h3 className="text-md font-semibold mb-2">Confirm Logout</h3>
        <p className="text-gray-600 mb-4">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={() => setOpenLogoutDialog(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Footer */}
  <footer className="text-xs text-gray-500 text-center py-4 border-t border-gray-300 mt-10">
    © 2025 JobPortal Admin. All rights reserved.
  </footer>
</div>
  );
};

export default AdminHome;
