import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminDataContext } from "@/context/AdminContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AdminProfile = () => {
  const { admin, updateAdmin, setIsLoading, setError } = useContext(AdminDataContext)!;
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("adminAccessToken");
        if (!token) throw new Error("Missing token");

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        updateAdmin(res.data.data.admin);
      } catch (err) {
        setError("Session expired. Please login again.");
        navigate("/admin-login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
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
      toast.success("Logout successful!");
      navigate("/admin-login");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Logout failed";
      setError(errMsg);
      alert(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/150?img=20"
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-white shadow"
          />
          <div>
            <h2 className="text-2xl font-semibold">
              {admin?.admin_firstname} {admin?.admin_lastname}
            </h2>
            <p className="text-muted-foreground text-sm">Super Admin</p>
          </div>
        </div>

        {/* Profile Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          {/* Sidebar Info */}
          <aside className="md:col-span-1 bg-card rounded-lg shadow p-4">
            <h3 className="text-md font-semibold mb-3">Contact Info</h3>
            <ul className="space-y-2 text-xs">
              <li><strong>Email:</strong> {admin?.admin_email}</li>
              <li><strong>Phone:</strong> +91 9876543210</li>
              <li><strong>Username:</strong> admin_jaydeep</li>
            </ul>
            <hr className="my-4 border-border" />
            <h3 className="text-md font-semibold mb-3">Account</h3>
            <ul className="space-y-2 text-xs">
              <li><strong>Role:</strong> Administrator</li>
              <li><strong>Joined:</strong> June 2024</li>
            </ul>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <section className="bg-card rounded-lg shadow p-4">
              <h3 className="text-md font-semibold mb-3">About</h3>
              <p className="text-xs mb-4">
                Hi, I'm {admin?.admin_firstname}! I manage users, jobs, and configurations across the portal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

            {/* Skills */}
            <section className="bg-card rounded-lg shadow p-4">
              <h3 className="text-md font-semibold mb-3">Skills</h3>
              <ul className="list-disc list-inside text-xs">
                <li>Project Management</li>
                <li>Database Administration</li>
                <li>Team Leadership</li>
              </ul>
            </section>

            {/* Achievements */}
            <section className="bg-card rounded-lg shadow p-4">
              <h3 className="text-md font-semibold mb-3">Achievements</h3>
              <ul className="list-disc list-inside text-xs">
                <li>Employee of the Year - 2024</li>
                <li>Implemented secure token-based auth system</li>
              </ul>
            </section>

            {/* Projects */}
            <section className="bg-card rounded-lg shadow p-4">
              <h3 className="text-md font-semibold mb-3">Projects</h3>
              <ul className="list-disc list-inside text-xs">
                <li>Job Portal Automation System</li>
                <li>Admin Dashboard Analytics Module</li>
              </ul>
            </section>
          </div>
        </section>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <motion.div
            className="bg-card w-[90%] max-w-sm rounded-lg p-6 text-sm shadow-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-md font-semibold mb-2">Confirm Logout</h3>
            <p className="text-muted-foreground mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-1 bg-muted hover:bg-muted/80 rounded">
                Cancel
              </button>
              <button onClick={handleLogout} className="px-4 py-1 bg-destructive text-white hover:bg-destructive/90 rounded">
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
