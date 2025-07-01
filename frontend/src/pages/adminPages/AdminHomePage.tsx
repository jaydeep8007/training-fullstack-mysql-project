import { useEffect, useContext, useState, useRef } from "react";
import { AdminDataContext } from "@/context/AdminContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "@/layout/sidebar";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import AdminMain from "@/layout/adminMain";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

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
        setOpenLogoutDialog(false);
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
    <div className="flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />

      <div className={`flex-1 min-h-screen bg-[#f2eff32d] text-[#1d2226] font-sans text-[15px] transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="text-blue-600 text-lg font-semibold">Loading...</div>
          </div>
        )}

        <Header
          setSidebarOpen={setSidebarOpen}
          setOpenLogoutDialog={setOpenLogoutDialog}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />

        <main className="">
          <AdminMain admin={admin} />
        </main>

        {openLogoutDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-gray-600 rounded p-6 w-[90%] max-w-sm shadow-lg text-sm">
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

        <Footer />
      </div>
    </div>
  );
};

export default AdminHome;
