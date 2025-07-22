import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Role {
  role_id: number;
  role_name: string;
  role_status: "active" | "inactive";
}

export const RolesAndPermissions = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/role`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
          },
        });
      const data: Role[] = res.data?.data || [];
      setRoles(data);
    } catch (err) {
      toast.error("Failed to fetch roles and permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/roles/${id}`, {
        withCredentials: true,
      });
      toast.success("Role deleted");
      fetchRoles();
    } catch {
      toast.error("Failed to delete role");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Roles & Permissions</h2>
        <button
          onClick={() => navigate("/admin/roles-and-permissions/add-roles")}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:scale-110 transition"
        >
          Add Role
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-6 w-6 text-purple-600" />
        </div>
      ) : roles.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No roles found.</div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.role_id}
                  className="border-b border-gray-200 odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  <td className="px-4 py-3 font-medium">{role.role_name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        role.role_status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {role.role_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/roles-and-permissions/edit-role/${role.role_id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4 inline-block" />
                    </button>
                    <button
                      onClick={() => handleDelete(role.role_id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RolesAndPermissions;
