import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CustomerDataContext } from "../../context/CustomerContext";
import { Menu, User, LogOut, Home, Settings } from "lucide-react";
import { toast } from "react-toastify";

const CustomerProfile = () => {
  const { customer, updateCustomer, setIsLoading, setError } =
    useContext(CustomerDataContext)!;
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
      // ✅ Success toast
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
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827] font-sans">
      {/* Top Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between relative">
        <h1 className="text-lg font-bold">Customer Profile</h1>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <Menu className="w-4 h-4" /> Menu
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow text-sm z-50">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center w-full px-3 py-2 hover:bg-gray-100 transform transition-transform duration-300 active:scale-95"
              >
                <Home className="w-4 h-4 mr-2" /> Home
              </button>
              <button
                onClick={() => navigate("/customer-profile")}
                className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
              >
                <User className="w-4 h-4 mr-2" /> View Profile
              </button>
              <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-gray-100 transform transition-transform duration-300 active:scale-95"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Profile Cover */}
      <div
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute bottom-[-40px] left-6 flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
          <div>
            <h2 className="text-xl font-semibold text-white drop-shadow">
              {customer?.cus_firstname} {customer?.cus_lastname}
            </h2>
            <p className="text-sm text-white/90">Premium Member</p>
          </div>
        </div>
      </div>

      {/* Profile Main Content */}
      <main className="mt-16 px-6 py-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <aside className="md:col-span-1 bg-white rounded-lg shadow p-4 text-sm">
            <h3 className="text-md font-semibold mb-3">Contact Info</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Email:</strong> {customer?.cus_email}
              </li>
              <li>
                <strong>Phone:</strong> +91 9876543210
              </li>
              <li>
                <strong>Username:</strong> jaydeep_95
              </li>
            </ul>

            <hr className="my-4" />

            <h3 className="text-md font-semibold mb-3">Account</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Joined:</strong> January 2024
              </li>
              <li>
                <strong>Membership:</strong> Premium
              </li>
            </ul>
          </aside>

          {/* Right Column */}
          <section className="md:col-span-2 bg-white rounded-lg shadow p-4 text-sm">
            <h3 className="text-md font-semibold mb-3">About</h3>
            <p className="text-gray-700 mb-4">
              Hi, I'm {customer?.cus_firstname}! I'm currently registered with
              our portal and have access to premium features. This section can
              include your bio, professional details, and more to come soon.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Date of Birth:</strong> 12 March 1995
                </p>
                <p>
                  <strong>Address:</strong> 123 Street Lane, Ahmedabad, Gujarat
                </p>
              </div>
              <div>
                <p>
                  <strong>Status:</strong> Active
                </p>
                <p>
                  <strong>Last Login:</strong> 27 June 2025
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed  inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-[90%] rounded-lg p-6  max-w-sm text-sm shadow-md">
            <h3 className="text-md font-semibold mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 bg-red-600 text-white hover:bg-red-700 rounded"
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

export default CustomerProfile;
