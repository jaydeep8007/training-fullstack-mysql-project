import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Admin {
    admin_id: number; // ✅ Add this line
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
  const [resultsPerPage] = useState(5);
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
    <div className="p-6">
<div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Admin List</h2>
  <button
    onClick={() => window.location.href = "/admin/user-management/add-admin"}
    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
  >
    Add User
  </button>
</div>

  <div className="flex flex-col justify-between min-h-[calc(100vh-150px)] relative">
    {/* Scrollable Table Section */}
    <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-100 text-left text-xs font-semibold uppercase text-gray-700">
          <tr>
            <th className="px-4 py-3">First Name</th>
            <th className="px-4 py-3">Last Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : admins.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                No admins found.
              </td>
            </tr>
          ) : (
            admins.map((admin, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">{admin.admin_firstname}</td>
                <td className="px-4 py-3">{admin.admin_lastname}</td>
                <td className="px-4 py-3">{admin.admin_email}</td>
                <td className="px-4 py-3">{admin.admin_phone_number}</td>
                <td className="px-4 py-3">{admin.roles?.role_name}</td>
            
            <td className="px-4 py-3 text-center space-x-2">
  <button
    className="text-blue-600 hover:text-blue-800"
    onClick={() => navigate(`/admin/user-management/edit-admin/${admin.admin_id}`)}
  >
    <Pencil size={16} />
  </button>
  <button className="text-red-600 hover:text-red-800">
    <Trash2 size={16} />
  </button>
</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Sticky Pagination Section */}
    {totalAdmins > 0 && (
      <div className="w-full flex justify-between items-center px-4 py-3 border-t bg-white text-sm sticky bottom-0 z-10">
        <div className="text-gray-600">
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
                className={`px-3 py-1 border rounded text-sm ${
                  page === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-800 hover:bg-gray-200"
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
</div>

  );
};

export default AdminList;
