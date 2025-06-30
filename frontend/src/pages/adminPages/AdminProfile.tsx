import { useEffect, useContext, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminDataContext } from "../../context/AdminContext";
import { Menu, User, LogOut, Home, Settings, Edit } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const AdminProfile = () => {
  const { admin, updateAdmin, setIsLoading, setError } = useContext(AdminDataContext)!;
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const updateSectionRef = useRef<HTMLDivElement | null>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

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
      const errMsg = error?.response?.data?.message || "Logout failed";
      setError(errMsg);
      alert(errMsg);
    }
  };

  const scrollToUpdate = () => {
    updateSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white font-sans text-sm">
      {/* Top Navbar */}
      <header className="bg-[#1f1f3b] shadow px-4 py-3 flex justify-between items-center relative">
        <h1 className="text-lg font-bold">Admin Profile</h1>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-800 rounded hover:bg-purple-700"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <Menu className="w-4 h-4" /> Menu
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-44 bg-[#2b2b44] border border-purple-700 rounded shadow text-sm z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => navigate("/admin-home")}
                  className="flex items-center w-full px-3 py-2 hover:bg-purple-600"
                >
                  <Home className="w-4 h-4 mr-2" /> Home
                </button>
                <button
                  onClick={() => navigate("/admin-profile")}
                  className="flex items-center w-full px-3 py-2 hover:bg-purple-600"
                >
                  <User className="w-4 h-4 mr-2" /> View Profile
                </button>
                <button onClick={scrollToUpdate} className="flex items-center w-full px-3 py-2 hover:bg-purple-600">
                  <Edit className="w-4 h-4 mr-2" /> Update Profile
                </button>
                <button className="flex items-center w-full px-3 py-2 hover:bg-purple-600">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </button>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center w-full px-3 py-2 text-red-400 hover:bg-purple-600"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Cover & Avatar */}
      <div
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute bottom-[-40px] left-6 flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/150?img=20"
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-white shadow"
          />
          <div>
            <h2 className="text-xl font-semibold text-white drop-shadow">
              {admin?.admin_firstname} {admin?.admin_lastname}
            </h2>
            <p className="text-sm text-white/90">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <main className="mt-16 px-6 py-6 max-w-5xl mx-auto space-y-8">
        <section className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1 bg-[#2d2d4f] rounded-lg shadow p-4">
            <h3 className="text-md font-semibold mb-3 text-purple-300">Contact Info</h3>
            <ul className="space-y-2 text-xs">
              <li><strong>Email:</strong> {admin?.admin_email}</li>
              <li><strong>Phone:</strong> +91 9876543210</li>
              <li><strong>Username:</strong> admin_jaydeep</li>
            </ul>
            <hr className="my-4 border-purple-700" />
            <h3 className="text-md font-semibold mb-3 text-purple-300">Account</h3>
            <ul className="space-y-2 text-xs">
              <li><strong>Role:</strong> Administrator</li>
              <li><strong>Joined:</strong> June 2024</li>
            </ul>
          </aside>

          {/* Main Section */}
          <section className="md:col-span-2 bg-[#2d2d4f] rounded-lg shadow p-4">
            <h3 className="text-md font-semibold mb-3 text-purple-300">About</h3>
            <p className="text-xs text-gray-300 mb-4">
              Hi, I'm {admin?.admin_firstname}! I manage users, jobs, and configurations across the portal. My role spans operations, oversight, and strategy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
              <div>
                <p><strong>Department:</strong> Administration</p>
                <p><strong>Permissions:</strong> Full Access</p>
              </div>
              <div>
                <p><strong>Status:</strong> Active</p>
                <p><strong>Last Login:</strong> 30 June 2025</p>
              </div>
            </div>
          </section>
        </section>

        {/* Editable Section */}
        <section ref={updateSectionRef} className="bg-[#2d2d4f] rounded-lg shadow p-4">
          <h3 className="text-md font-semibold mb-3 text-purple-300">Update Profile</h3>
          <form className="grid md:grid-cols-2 gap-4 text-xs">
            <input type="text" defaultValue={admin?.admin_firstname} className="px-3 py-2 rounded bg-[#1c1c35] text-white" placeholder="First Name" />
            <input type="text" defaultValue={admin?.admin_lastname} className="px-3 py-2 rounded bg-[#1c1c35] text-white" placeholder="Last Name" />
            <input type="email" defaultValue={admin?.admin_email} className="px-3 py-2 rounded bg-[#1c1c35] text-white col-span-2" placeholder="Email" />
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded col-span-2 mt-4">Save Changes</button>
          </form>
        </section>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <motion.div
            className="bg-white w-[90%] max-w-sm rounded-lg p-6 text-sm shadow-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-md font-semibold mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
              <button onClick={handleLogout} className="px-4 py-1 bg-red-600 text-white hover:bg-red-700 rounded">Logout</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
