import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("active");
  const [resources, setResources] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<{ [key: number]: number[] }>({});
const [loading, setLoading] = useState(false);
  const permissionLabels = ["Create", "Read", "Update", "Delete"];

  const [assignedCount, setAssignedCount] = useState(0);

const fetchAssignedAdminCount = async () => {
  try {
    const token = localStorage.getItem("adminAccessToken");
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/role/${id}/assigned-admins`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAssignedCount(res.data?.count || 0);
  } catch (err: any) {
    console.error("❌ Error fetching assigned admins:", err.response?.data || err.message);
    toast.error("Failed to check assigned admins");
  }
};

const fetchResources = async () => {
  try {
    const token = localStorage.getItem("adminAccessToken");
    if (!token) {
      toast.error("Unauthorized: No token found");
      return;
    }

    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/resources`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setResources(res.data?.data || []);
  } catch (err: any) {
    console.error("❌ Error fetching resources:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to fetch resources");
  }
};


const fetchRoleData = async () => {
  try {
    const token = localStorage.getItem("adminAccessToken");
    if (!token) {
      toast.error("Unauthorized: No token found");
      return;
    }

    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/role/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data?.data;
    setRoleName(data?.role_name || "");
    setStatus(data?.role_status || "active");

    const mappedPermissions: { [key: number]: number[] } = {};
    data?.permissions?.forEach((perm: any) => {
      const resourceId = perm.resource.resource_id;
      mappedPermissions[resourceId] = [];
      if (perm.admin_permission_can_create) mappedPermissions[resourceId].push(0);
      if (perm.admin_permission_can_read) mappedPermissions[resourceId].push(1);
      if (perm.admin_permission_can_update) mappedPermissions[resourceId].push(2);
      if (perm.admin_permission_can_delete) mappedPermissions[resourceId].push(3);
    });

    setPermissions(mappedPermissions);
  } catch (err: any) {
    console.error("❌ Error loading role data:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to load role data");
  }
};

  useEffect(() => {
    fetchResources();
    fetchRoleData();
     fetchAssignedAdminCount();
  }, [id]);

  const handleCheckboxChange = (resourceId: number, permIndex: number) => {
    setPermissions((prev) => {
      const current = prev[resourceId] || [];
      const updated = current.includes(permIndex)
        ? current.filter((val) => val !== permIndex)
        : [...current, permIndex];
      return { ...prev, [resourceId]: updated };
    });
  };

  const canDeactivateRole = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("adminAccessToken");
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/role/${id}/assigned-admins`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const count = res.data?.data?.count || 0;
    return count === 0; // ✅ true if safe to deactivate
  } catch (err: any) {
    console.error("Error checking role assignment:", err.response?.data || err.message);
    toast.error("Failed to check if role is assigned");
    return false;
  }
};


const handleUpdateRole = async () => {
  const permissionArray = Object.entries(permissions).map(([resourceId, perms]) => ({
    resource_id: Number(resourceId),
    admin_permission_can_create: perms.includes(0),
    admin_permission_can_read: perms.includes(1),
    admin_permission_can_update: perms.includes(2),
    admin_permission_can_delete: perms.includes(3),
  }));

  if (permissionArray.length === 0) {
    toast.error("Please select at least one permission.");
    return;
  }

  const token = localStorage.getItem("adminAccessToken");
  if (!token) {
    toast.error("Unauthorized: No access token found");
    return;
  }

  try {
    setLoading(true);

    // 👇 Only check if trying to deactivate
    if (status === "inactive") {
      const canDeactivate = await canDeactivateRole();
      if (!canDeactivate) {
        toast.error("This role is assigned to users and cannot be deactivated.");
        return;
      }
    }

    const res = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/role/${id}`,
      {
        role_status: status ,
        permissions: permissionArray,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data?.message || "Role updated successfully");
    navigate("/admin/roles-and-permissions");
  } catch (err: any) {
    console.error("Error updating role:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to update role");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-6">
      {/* <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Edit Role</h2> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="active">Active</option>
            <option value="inactive" disabled={assignedCount > 0}>
  Inactive {assignedCount > 0 ? "(Assigned)" : ""}
</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">Module Permissions</h3>
        <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 border">Module</th>
                {permissionLabels.map((label) => (
                  <th key={label} className="p-3 border text-center">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.resource_id} className="bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                  <td className="p-3 border text-gray-800 dark:text-gray-200 font-medium">
                    {resource.resource_name}
                  </td>
                  {permissionLabels.map((_, index) => (
                    <td key={index} className="p-3 border text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={permissions[resource.resource_id]?.includes(index) || false}
                        onChange={() => handleCheckboxChange(resource.resource_id, index)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              {resources.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 p-4">
                    No modules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    <div className="flex justify-end gap-3 mt-6">
  <button
    type="submit"
    onClick={handleUpdateRole}
    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm transition"
  >
    {loading ? "Updating..." : "Update Role"}
  </button>
  <button
    type="button"
    onClick={() => navigate("/admin/roles-and-permissions")}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
  >
    Cancel
  </button>
</div>
    </div>
  );
};

export default EditRole;
