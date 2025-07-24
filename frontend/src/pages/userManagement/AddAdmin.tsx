import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

type Role = {
  role_id: number;
  role_name: string;
};

type FormData = {
  admin_firstname: string;
  admin_lastname: string;
  admin_email: string;
  admin_phone_number: string;
  role_id: number | "";
};



const AddAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    admin_firstname: "",
    admin_lastname: "",
    admin_email: "",
    admin_phone_number: "",
    role_id: "",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem("adminAccessToken");
      if (!token) {
        toast.error("Unauthorized: No access token found");
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/role`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredRoles = (res.data?.data || []).filter(
          (role: Role) => role.role_name !== "Super Admin"
        );

        setRoles(filteredRoles);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load roles");
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role_id" ? Number(value) : value,
    }));
  };

    const handleCreateWithoutLink = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("adminAccessToken");
    if (!token) {
      toast.error("Unauthorized: No access token found");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/create-without-password`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data?.message || "Admin created successfully");
      navigate("/admin/user-management");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to create admin";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("adminAccessToken");
    if (!token) {
      toast.error("Unauthorized: No access token found");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data?.message || "Admin created successfully");
      navigate("/admin/user-management");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create admin";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
     className="w-full mt-3 max-w-[97%] mx-auto bg-background border border-border rounded-lg px-4 md:px-6 py-6 shadow-sm">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
      >
        {/* First Name */}
        <div>
          <label className="block text-xs text-gray-600 font-medium mb-1">First Name</label>
          <input
            type="text"
            name="admin_firstname"
            value={formData.admin_firstname}
            onChange={handleChange}
            required
            placeholder="Enter first name"
            className="w-full border px-2 py-1.5 rounded-md text-xs"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs text-gray-600  font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="admin_lastname"
            value={formData.admin_lastname}
            onChange={handleChange}
            required
            placeholder="Enter last name"
            className="w-full border px-2 py-1.5 rounded-md text-xs"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs text-gray-600  font-medium mb-1">Email</label>
          <input
            type="email"
            name="admin_email"
            value={formData.admin_email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
            className="w-full border px-2 py-1.5 rounded-md text-xs"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs text-gray-600  font-medium mb-1">Phone Number</label>
          <input
            type="text"
            name="admin_phone_number"
            value={formData.admin_phone_number}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
            className="w-full border px-2 py-1.5 rounded-md text-xs"
          />
        </div>

        {/* Role */}
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-600  font-medium mb-1">Role</label>
          <select
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            required
            className="w-full border px-2 py-1.5 rounded-md text-xs"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>
        {/* Buttons */}
    <div className="md:col-span-2 flex justify-end items-center gap-3 mt-4">
  <button
    type="button"
    onClick={handleCreateWithoutLink} // Add this function below
    disabled={isLoading}
    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm transition"
  >
    {isLoading ? "Creating..." : "Create Admin"}
  </button>
  <button
    type="submit"
    disabled={isLoading}
    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm transition"
  >
    {isLoading ? "Sending..." : "Send Password Create Link"}
  </button>



  <button
    type="button"
    onClick={() => navigate("/admin/user-management")}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
  >
    Cancel
  </button>
</div>

      </form>
    </motion.div>
  );
};

export default AddAdmin;
