import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

interface Admin {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_id: number;
}

interface Role {
  role_id: number;
  role_name: string;
}

const EditAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState<Admin>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_id: 0,
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmin = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });
      const data = res.data?.data;
      if (data) {
        setAdminData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          role_id: Number(data.role_id) || 0,
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/role`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });

      const roles: Role[] = res.data?.data || [];
      const filtered = roles.filter((role) => role.role_name !== "Super Admin");
      setRoles(filtered);
    } catch (err) {
      console.error("Error fetching roles:", err);
      toast.error("Failed to load roles");
    }
  };

  useEffect(() => {
    if (id) {
      fetchAdmin();
      fetchRoles();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: name === "role_id" ? Number(value) : value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/${id}`,
        adminData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
          },
        }
      );
      toast.success(res.data?.message || "Admin updated successfully");
      navigate("/admin/user-management");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-[97%] mt-3  mx-auto bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 ">
      {/* <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Edit Admin
      </h2> */}

      <form onSubmit={handleUpdate} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={adminData.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              className="w-full border rounded px-3 py-2 dark:bg-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={adminData.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full border rounded px-3 py-2 dark:bg-gray-800"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="w-full border rounded px-3 py-2 dark:bg-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={adminData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full border rounded px-3 py-2 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Role</label>
          <select
            name="role_id"
            value={adminData.role_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800"
            required
          >
            <option value="">Select role</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>

      <div className="flex justify-end gap-3 pt-4">

        {/* ✅ Update Button - Primary themed */}
  <button
    type="submit"
    className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200"
    disabled={submitting}
  >
    {submitting ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <Save className="w-4 h-4" />
        Update Admin
      </>
    )}
  </button>
  {/* ❌ Cancel Button - Red themed */}
  <button
    type="button"
    onClick={() => navigate("/admin/user-management")}
    className="flex items-center gap-2 px-5 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
  >
    <X className="w-4 h-4" />
    Cancel
  </button>

  
</div>

      </form>
    </div>
  );
};

export default EditAdmin;
