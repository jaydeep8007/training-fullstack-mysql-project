import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AddRole = () => {
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("active");
  const [resources, setResources] = useState<{ resource_id: number; resource_name: string }[]>([]);
  const [permissions, setPermissions] = useState<{ [resourceId: number]: number[] }>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/resources`);
        setResources(res.data?.data || []);
      } catch (err) {
        toast.error("Failed to load resources");
      }
    };
    fetchResources();
  }, []);

  const handleCheckboxChange = (resourceId: number, permissionIndex: number) => {
    setPermissions((prev) => {
      const current = prev[resourceId] || [];
      const updated = current.includes(permissionIndex)
        ? current.filter((val) => val !== permissionIndex)
        : [...current, permissionIndex];
      return { ...prev, [resourceId]: updated };
    });
  };

  const handleAddRole = async () => {
    const permissionArray = Object.entries(permissions).map(([resourceId, actions]) => ({
      resource_id: parseInt(resourceId),
      admin_permission_can_create: actions.includes(0),
      admin_permission_can_read: actions.includes(1),
      admin_permission_can_update: actions.includes(2),
      admin_permission_can_delete: actions.includes(3),
    }));

    if (!roleName || permissionArray.length === 0 || !status) {
      toast.error("Please enter role name, status and select at least one permission.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/role/add`, {
        role_name: roleName,
        status,
        permissions: permissionArray,
      });

      toast.success(res.data.message || "Role added");
      navigate("/admin/roles-and-permissions");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add role");
    }
  };

  const permissionLabels = ["Create", "Read", "Update", "Delete"];

  return (
    <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
     className="max-w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl  space-y-6">
      {/* <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Add New Role</h2> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">
  Role Name <span className="text-red-500">*</span>
</label>
          <input
            type="text"
            placeholder="e.g., HR Manager"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs  text-gray-500 dark:text-gray-300 mb-1">Status <span className="text-red-500">*</span></label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-600 dark:text-white mt-4 mb-2">Module Permissions</h3>
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
                  <td className="p-3 border text-gray-600 dark:text-gray-200 font-medium">
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

   <div className="md:col-span-2 flex justify-end items-center gap-3 mt-4">
  <button
    onClick={handleAddRole}
    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition"
  >
    Save Role
  </button>
    <button
    type="button"
    onClick={() => navigate("/admin/roles-and-permissions")}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
  >
    Cancel
  </button>
</div>
    </motion.div>
  );
};

export default AddRole;
