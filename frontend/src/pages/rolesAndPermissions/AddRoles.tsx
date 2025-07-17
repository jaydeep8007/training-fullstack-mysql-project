import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddRole = () => {
  const [roleName, setRoleName] = useState("");
  const [resources, setResources] = useState<{ resource_id: number; resource_name: string }[]>([]);
  const [permissions, setPermissions] = useState<{
    [resourceId: number]: number[]; // [0, 1, 2, 3] → create, read, update, delete
  }>({});

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
      can_create: actions.includes(0),
      can_read: actions.includes(1),
      can_update: actions.includes(2),
      can_delete: actions.includes(3),
    }));

    if (!roleName || permissionArray.length === 0) {
      toast.error("Please enter role name and select at least one permission.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/role/add`, {
        role_name: roleName,
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
    <div className="p-6 space-y-4 bg-background text-foreground">
      <h2 className="text-xl font-bold">Add Role</h2>

      <input
        type="text"
        placeholder="Enter Role Name"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
        className="w-full p-2 border rounded-md bg-input text-foreground"
      />

      <table className="w-full border text-sm mt-4">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 border">Module</th>
            {permissionLabels.map((label) => (
              <th key={label} className="p-2 border">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.resource_id}>
              <td className="p-2 border">{resource.resource_name}</td>
              {permissionLabels.map((_, index) => (
                <td key={index} className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={permissions[resource.resource_id]?.includes(index) || false}
                    onChange={() => handleCheckboxChange(resource.resource_id, index)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleAddRole}
        className="mt-4 px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/80"
      >
        Save Role
      </button>
    </div>
  );
};

export default AddRole;
