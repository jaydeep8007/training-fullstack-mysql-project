import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface AddCustomerProps {
  onSuccess?: () => void;
}

const AddCustomer = ({ onSuccess }: AddCustomerProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cus_firstname: "",
    cus_lastname: "",
    cus_email: "",
    cus_phone_number: "",
    cus_password: "",
    cus_confirm_password: "",
    cus_status: "active",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const {
      cus_firstname,
      cus_lastname,
      cus_email,
      cus_phone_number,
      cus_password,
      cus_confirm_password,
    } = formData;

    if (!cus_firstname.trim()) newErrors.cus_firstname = "First name is required";
    if (!cus_lastname.trim()) newErrors.cus_lastname = "Last name is required";
    if (!cus_email.trim()) newErrors.cus_email = "Email is required";
    if (!cus_phone_number.trim()) newErrors.cus_phone_number = "Phone number is required";
    if (!cus_password.trim()) newErrors.cus_password = "Password is required";
    if (!cus_confirm_password.trim())
      newErrors.cus_confirm_password = "Confirm password is required";
    else if (cus_password !== cus_confirm_password)
      newErrors.cus_confirm_password = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BASE_URL}/customer`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
          },
        });

      toast.success("✅ Customer created successfully!");
      navigate("/admin/customers"); // go back to list page
      if (onSuccess) onSuccess();
      else navigate("/admin/customers");
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.join(", ") ||
        "❌ Something went wrong.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-full max-w-full mx-auto bg-background border border-border rounded-lg px-4 md:px-6 py-6 shadow-sm">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-xs font-medium mb-1">First Name</label>
          <input
            type="text"
            name="cus_firstname"
            value={formData.cus_firstname}
            onChange={handleChange}
            className="w-full border px-2 py-1.5 rounded-md text-sm"
          />
          {errors.cus_firstname && (
            <p className="text-red-500 text-xs mt-1">{errors.cus_firstname}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="cus_lastname"
            value={formData.cus_lastname}
            onChange={handleChange}
            className="w-full border px-2 py-1.5 rounded-md text-sm"
          />
          {errors.cus_lastname && (
            <p className="text-red-500 text-xs mt-1">{errors.cus_lastname}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <input
            type="email"
            name="cus_email"
            value={formData.cus_email}
            onChange={handleChange}
            className="w-full border px-2 py-1.5 rounded-md text-sm"
          />
          {errors.cus_email && (
            <p className="text-red-500 text-xs mt-1">{errors.cus_email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="cus_phone_number"
            value={formData.cus_phone_number}
            onChange={handleChange}
            className="w-full border px-2 py-1.5 rounded-md text-sm"
          />
          {errors.cus_phone_number && (
            <p className="text-red-500 text-xs mt-1">{errors.cus_phone_number}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium mb-1">Password</label>
          <input
            type="password"
            name="cus_password"
            value={formData.cus_password}
            onChange={handleChange}
            className="w-full border px-2 py-1.5 rounded-md text-sm"
          />
          {errors.cus_password && (
            <p className="text-red-500 text-xs mt-1">{errors.cus_password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            name="cus_confirm_password"
            value={formData.cus_confirm_password}
            onChange={handleChange}
            className="w-full border px-2 py-1.5 rounded-md text-sm"
          />
          {errors.cus_confirm_password && (
            <p className="text-red-500 text-xs mt-1">{errors.cus_confirm_password}</p>
          )}
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1">Status</label>
          <select
            name="cus_status"
            value={formData.cus_status}
            onChange={handleChange}
            className="w-full border px-2 py-1.5 rounded-md text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
            <option value="restricted">Restricted</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-between items-center mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm"
          >
            {loading ? "Adding..." : "Add Customer"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/customers")}
            className="text-sm text-red-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
