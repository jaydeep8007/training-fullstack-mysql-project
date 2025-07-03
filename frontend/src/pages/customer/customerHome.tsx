import { useEffect, useContext, useState } from "react";
import { CustomerDataContext } from "../../context/CustomerContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const CustomerHome = () => {
  const navigate = useNavigate();
  const { customer, updateCustomer, setIsLoading, setError, isLoading } =
    useContext(CustomerDataContext)!;

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("customerAccessToken");
        if (!token) throw new Error("Missing token");

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/customer/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        updateCustomer(response.data.data.customer);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError("Session expired. Please login again.");
        navigate("/customer-login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("customerAccessToken");

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/customer/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      updateCustomer(null);
      localStorage.removeItem("customerAccessToken");
      toast.success("Logout successful! 🎉");
      navigate("/customer-login");
    } catch (error: any) {
      console.error("Logout error:", error);
      const errMsg = error?.response?.data?.message || "Logout failed";
      setError(errMsg);
      alert(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans text-sm">
      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <FiX
            className="cursor-pointer"
            size={24}
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <nav className="flex flex-col gap-3 p-4">
          <button
            className="text-left hover:text-green-400"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className="text-left hover:text-green-400"
            onClick={() => navigate("/settings")}
          >
            Settings
          </button>
          <button
            className="text-left hover:text-green-400"
            onClick={() => navigate("/users")}
          >
            User Management
          </button>
          <button
            className="text-left hover:text-green-400"
            onClick={() => navigate("/jobs")}
          >
            Jobs
          </button>
          <button
            className="text-left hover:text-green-400"
            onClick={() => navigate("/reports")}
          >
            Reports
          </button>
        </nav>
      </div>

      {/* Navbar */}
      <header className="bg-white shadow-md px-6 py-3 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <FiMenu
            className="cursor-pointer"
            size={24}
            onClick={() => setSidebarOpen(true)}
          />
          <h1 className="text-lg font-bold tracking-tight text-green-600">
            JobConnect
          </h1>
        </div>
        <div className="relative">
          <FaUserCircle
            className="w-7 h-7 cursor-pointer text-gray-700"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md text-sm z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate("/customer-profile")}
              >
                View Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate("/account-settings")}
              >
                Account Settings
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate("/notifications")}
              >
                Notifications
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate("/help")}
              >
                Help & Support
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={() => setOpenLogoutDialog(true)}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="p-6">
        {isLoading && (
          <div className="p-6 text-blue-600 font-medium text-center">
            Loading profile...
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-base font-semibold mb-2">
            Welcome, {customer?.firstname || "Jaydeep"}!
          </h2>
          <p className="text-gray-600">
            This is your job portal dashboard. Use the navigation menu to
            explore profiles, jobs, and more.
          </p>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transform transition-transform duration-300 active:scale-95"
            onClick={() => navigate("/customer-profile")}
          >
            View Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white border p-4 rounded shadow">
            <h3 className="text-sm font-medium">Total Customers</h3>
            <p className="text-2xl mt-1 text-green-600 font-bold">124</p>
          </div>
          <div className="bg-white border p-4 rounded shadow">
            <h3 className="text-sm font-medium">Total Employees</h3>
            <p className="text-2xl mt-1 text-blue-600 font-bold">58</p>
          </div>
          <div className="bg-white border p-4 rounded shadow">
            <h3 className="text-sm font-medium">Active Jobs</h3>
            <p className="text-2xl mt-1 text-yellow-500 font-bold">35</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 p-4 rounded shadow transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg hover:border-green-400 cursor-pointer"
            >
              <h4 className="text-sm font-semibold mb-1 text-green-600">
                Recent Activity #{index + 1}
              </h4>
              <p className="text-xs text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent vehicula mauris nec magna ullamcorper.
              </p>
            </div>
          ))}
        </div>
      </main>

      {openLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-[90%] max-w-sm shadow-lg text-sm">
            <h3 className="text-md font-semibold mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setOpenLogoutDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transform transition-transform duration-300 active:scale-95"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerHome;
