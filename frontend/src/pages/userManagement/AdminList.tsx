import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Admin {
  admin_id: number;
  admin_firstname: string;
  admin_lastname: string;
  admin_email: string;
  admin_phone_number: string;
  role_id: number;
  roles: {
    role_name: string;
    role_status: string;
  };
}

const AdminList = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [totalAdmins, setTotalAdmins] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin?page=${page}&results_per_page=${resultsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
            },
          }
        );
        setAdmins(res.data?.data?.rows || []);
        setTotalAdmins(res.data?.data?.count || 0);
      } catch (err) {
        console.error("Failed to fetch admins", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [page, resultsPerPage]);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Admin Users</h2>
        <button
          onClick={() => navigate("/admin/user-management/add-admin")}
          className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
        >
          Add
        </button>
      </div>

      {/* Table Container */}
      <div className="flex flex-col justify-between min-h-[calc(100vh-150px)] relative">
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <table className="min-w-full text-xs bg-white dark:bg-gray-900 dark:text-gray-100">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wide">
              <tr className="text-left">
                <th className="px-4 py-3 whitespace-nowrap">Full Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Email</th>
                <th className="px-4 py-3 whitespace-nowrap">Phone</th>
                <th className="px-4 py-3 whitespace-nowrap">Role</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No admins found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr
                    key={admin.admin_id}
                    className="border-b border-gray-200 dark:border-gray-700 odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {admin.admin_firstname} {admin.admin_lastname}
                    </td>
                    <td className="px-4 py-3 text-blue-600 hover:underline dark:text-blue-400 cursor-pointer">
                      {admin.admin_email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{admin.admin_phone_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{admin.roles?.role_name}</td>
                    <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">
                      <button
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:scale-110 transition-transform duration-200"
                        onClick={() => navigate(`/admin/user-management/view-admin/${admin.admin_id}`)}
                        title="View Admin"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:scale-110 transition-transform duration-200"
                        onClick={() => navigate(`/admin/user-management/edit-admin/${admin.admin_id}`)}
                        title="Edit Admin"
                      >
                        <Pencil size={16} />
                      </button>
                      {admin.roles?.role_name === "Super Admin" ? (
                        <button
                          className="text-gray-400 cursor-not-allowed dark:text-gray-500"
                          disabled
                          title="Super Admin cannot be deleted"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:scale-110 transition-transform duration-200"
                          // onClick={() => handleDelete(admin.admin_id)}
                          title="Delete Admin"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalAdmins > 0 && (
          <div className="w-full flex justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
            <div className="text-gray-600 dark:text-gray-300">
              Showing {(page - 1) * resultsPerPage + 1} -{" "}
              {Math.min(page * resultsPerPage, totalAdmins)} of {totalAdmins} admins
            </div>
            <div className="flex gap-1">
              {[...Array(Math.ceil(totalAdmins / resultsPerPage))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded border text-sm transition ${
                      page === pageNum
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-400 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminList;
