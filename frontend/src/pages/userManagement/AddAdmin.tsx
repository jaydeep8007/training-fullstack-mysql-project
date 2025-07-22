import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
      console.error("Error fetching roles:", error.response?.data || error.message);
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
    <div className="p-8 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-8 text-gray-800">
        Add New Admin
      </h2>

       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    {/* First Name */}
    <div>
      <label htmlFor="admin_firstname" className="block mb-1 font-medium text-gray-700">
        First Name
      </label>
      <input
        type="text"
        id="admin_firstname"
        name="admin_firstname"
        value={formData.admin_firstname}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>

    {/* Last Name */}
    <div>
      <label htmlFor="admin_lastname" className="block mb-1 font-medium text-gray-700">
        Last Name
      </label>
      <input
        type="text"
        id="admin_lastname"
        name="admin_lastname"
        value={formData.admin_lastname}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>

    {/* Email */}
    <div>
      <label htmlFor="admin_email" className="block mb-1 font-medium text-gray-700">
        Email
      </label>
      <input
        type="email"
        id="admin_email"
        name="admin_email"
        value={formData.admin_email}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>

    {/* Phone Number */}
    <div>
      <label htmlFor="admin_phone_number" className="block mb-1 font-medium text-gray-700">
        Phone Number
      </label>
      <input
        type="text"
        id="admin_phone_number"
        name="admin_phone_number"
        value={formData.admin_phone_number}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>

    {/* Role */}
    <div className="md:col-span-2">
      <label htmlFor="role_id" className="block mb-1 font-medium text-gray-700">
        Role
      </label>
      <select
        id="role_id"
        name="role_id"
        value={formData.role_id}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="">Select Role</option>
        {roles.map((role) => (
          <option key={role.role_id} value={role.role_id}>
            {role.role_name}
          </option>
        ))}
      </select>
    </div>

    {/* Submit Button */}
    <div className="md:col-span-2 flex justify-end pt-2">
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        {isLoading ? "Sending..." : "Send Password Create Link"}
      </button>
    </div>
  </form>
    </div>
  );
};

export default AddAdmin;
