import { useEffect, useContext, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminDataContext } from "../../context/AdminContext";
import { Menu, User, LogOut, Home, Settings } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const AdminProfile = () => {
  const { admin, updateAdmin, setIsLoading, setError } = useContext(AdminDataContext)!;
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans text-sm">
      <header className="bg-slate-800 shadow px-4 py-3 flex justify-between items-center relative">
        <h1 className="text-lg font-bold">Admin Profile</h1>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-700 rounded hover:bg-slate-600"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <Menu className="w-4 h-4" /> Menu
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded shadow text-sm z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => navigate("/admin-home")}
                  className="flex items-center w-full px-3 py-2 hover:bg-slate-700"
                >
                  <Home className="w-4 h-4 mr-2" /> Home
                </button>
                <button
                  onClick={() => navigate("/admin-profile")}
                  className="flex items-center w-full px-3 py-2 hover:bg-slate-700"
                >
                  <User className="w-4 h-4 mr-2" /> View Profile
                </button>
                <button className="flex items-center w-full px-3 py-2 hover:bg-slate-700">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </button>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center w-full px-3 py-2 text-red-400 hover:bg-slate-700"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

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

      <main className="mt-16 px-6 py-6 max-w-5xl mx-auto space-y-6">
        <section className="grid md:grid-cols-3 gap-6">
          <aside className="md:col-span-1 bg-slate-800 rounded-lg shadow p-4">
            <h3 className="text-md font-semibold mb-3 text-slate-300">Contact Info</h3>
            <ul className="space-y-2 text-xs">
              <li><strong>Email:</strong> {admin?.admin_email}</li>
              <li><strong>Phone:</strong> +91 9876543210</li>
              <li><strong>Username:</strong> admin_jaydeep</li>
            </ul>
            <hr className="my-4 border-slate-700" />
            <h3 className="text-md font-semibold mb-3 text-slate-300">Account</h3>
            <ul className="space-y-2 text-xs">
              <li><strong>Role:</strong> Administrator</li>
              <li><strong>Joined:</strong> June 2024</li>
            </ul>
          </aside>

          <div className="md:col-span-2 space-y-6">
            <section className="bg-slate-800 rounded-lg shadow p-4">
              <h3 className="text-md font-semibold mb-3 text-slate-300">About</h3>
              <p className="text-xs text-slate-300 mb-4">
                Hi, I'm {admin?.admin_firstname}! I manage users, jobs, and configurations across the portal. My role spans operations, oversight, and strategy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
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

            <section className="bg-slate-800 rounded-lg shadow p-4">
              <h3 className="text-md font-semibold mb-3 text-slate-300">Skills</h3>
              <ul className="list-disc list-inside text-xs text-slate-300">
                <li>Project Management</li>
                <li>Database Administration</li>
                <li>Team Leadership</li>
              </ul>
            </section>

            <section className="bg-slate-800 rounded-lg shadow p-4">
              <h3 className="text-md font-semibold mb-3 text-slate-300">Achievements</h3>
              <ul className="list-disc list-inside text-xs text-slate-300">
                <li>Employee of the Year - 2024</li>
                <li>Implemented secure token-based auth system</li>
              </ul>
            </section>

            <section className="bg-slate-800 rounded-lg shadow p-4">
              <h3 className="text-md font-semibold mb-3 text-slate-300">Projects</h3>
              <ul className="list-disc list-inside text-xs text-slate-300">
                <li>Job Portal Automation System</li>
                <li>Admin Dashboard Analytics Module</li>
              </ul>
            </section>
          </div>
        </section>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <motion.div
            className="bg-white dark:bg-slate-800 w-[90%] max-w-sm rounded-lg p-6 text-sm shadow-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-md font-semibold mb-2">Confirm Logout</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-slate-600 dark:hover:bg-slate-500 rounded">Cancel</button>
              <button onClick={handleLogout} className="px-4 py-1 bg-red-600 text-white hover:bg-red-700 rounded">Logout</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
