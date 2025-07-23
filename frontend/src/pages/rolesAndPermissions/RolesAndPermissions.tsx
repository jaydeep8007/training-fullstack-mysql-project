import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Role {
  role_id: number;
  role_name: string;
  role_status: string;
}

const RolesAndPermissions = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [resultsPerPage] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/role`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });
      const data: Role[] = res.data?.data || [];
      setRoles(data);
      setTotal(data.length);
    } catch (err) {
      toast.error("Failed to fetch roles and permissions");
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async (id: number) => {
  //   try {
  //     await axios.delete(`${import.meta.env.VITE_BASE_URL}/role/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
  //       },
  //     });
  //     toast.success("Role deleted successfully");
  //     fetchRoles();
  //   } catch (err) {
  //     toast.error("Failed to delete role");
  //   }
  // };

  useEffect(() => {
    fetchRoles();
  }, []);

return (
  <div className="min-h-screen flex flex-col p-6 pb-24">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg text-gray-600 font-semibold">Roles & Permissions</h2>
      <button
        onClick={() => navigate("/admin/roles-and-permissions/add-roles")}
        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition"
      >
        Add
      </button>
    </div>

    {loading ? (
      <div className="text-center text-muted py-10 flex-grow">Loading...</div>
    ) : roles.length === 0 ? (
      <div className="text-center text-muted py-10 flex-grow">No roles found.</div>
    ) : (
      <div className="flex flex-col flex-grow">
        {/* Table */}
        <div className="overflow-x-auto shadow border border-border rounded-lg mb-6">
          <table className="min-w-full text-xs text-left border-collapse">
            <thead className="bg-muted text-muted-foreground uppercase text-xs tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3">Role Name</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles
                .slice((page - 1) * resultsPerPage, page * resultsPerPage)
                .map((role) => (
                  <tr
                    key={role.role_id}
                    className="border-b border-border odd:bg-background even:bg-muted/40 hover:bg-muted transition"
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
                          navigate(
                            `/admin/roles-and-permissions/edit-role/${role.role_id}`
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 inline-block" />
                      </button>
                      {role.role_name === "Super Admin" ? (
                        <button
                          disabled
                          className="text-gray-500 cursor-not-allowed"
                          title="Super Admin cannot be deleted"
                        >
                          <Trash2 className="w-4 h-4 inline-block" />
                        </button>
                      ) : (
                        <button
                          // onClick={() => handleDelete(role.role_id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 inline-block" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-auto pt-4 flex justify-between items-center px-2 text-sm text-gray-600 dark:text-gray-300">
          <div>
            Showing {(page - 1) * resultsPerPage + 1} -{" "}
            {Math.min(page * resultsPerPage, total)} of {total} roles
          </div>
          <div className="flex space-x-1">
            {[...Array(Math.ceil(total / resultsPerPage))].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded text-sm border ${
                    page === pageNum
                      ? "bg-primary text-white"
                      : "bg-white text-blue-800 hover:bg-muted dark:bg-background"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default RolesAndPermissions;
