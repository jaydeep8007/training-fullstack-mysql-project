import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface AddEmployeeProps {
  onSuccess?: () => void;
}

const AddEmployee = ({ onSuccess }: AddEmployeeProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emp_firstname: "",
    emp_lastname: "",
    emp_email: "",
    emp_password: "",
    emp_company_name: "",
    emp_mobile_number: "",
    cus_id: "", // ← now user can enter this
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const {
      emp_firstname,
      emp_lastname,
      emp_email,
      emp_password,
      emp_company_name,
      emp_mobile_number,
      cus_id,
    } = formData;

    if (!emp_firstname.trim()) newErrors.emp_firstname = "First name is required";
    if (!emp_lastname.trim()) newErrors.emp_lastname = "Last name is required";
    if (!emp_email.trim()) newErrors.emp_email = "Email is required";
    if (!emp_password.trim()) newErrors.emp_password = "Password is required";
    if (!emp_company_name.trim()) newErrors.emp_company_name = "Company name is required";
    if (!emp_mobile_number.trim()) newErrors.emp_mobile_number = "Mobile number is required";
    if (!cus_id.trim()) newErrors.cus_id = "Customer ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BASE_URL}/employee`, {
        ...formData,
        cus_id: Number(formData.cus_id), // ensure cus_id is a number
      }, {
        withCredentials: true,
      });

      toast.success("✅ Employee created successfully!");
      if (onSuccess) onSuccess();
      else navigate("/admin/employees");
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
    <div className="max-w-full mx-auto mt-8 bg-background border border-border rounded-2xl px-6 md:px-8 py-8 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary">Add New Employee</h2>
        <button
          type="button"
          onClick={() => navigate("/admin/employees")}
          className="text-sm text-red-500 font-medium hover:underline"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* First Name */}
        <div>
          <label className="block text-xs font-medium mb-1">First Name</label>
          <input
            type="text"
            name="emp_firstname"
            value={formData.emp_firstname}
            onChange={handleChange}
            className="w-full border border-border px-2 py-1.5 rounded-md text-xs bg-background text-foreground"
          />
          {errors.emp_firstname && <p className="text-red-500 text-xs mt-1">{errors.emp_firstname}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="emp_lastname"
            value={formData.emp_lastname}
            onChange={handleChange}
            className="w-full border border-border px-2 py-1.5 rounded-md text-xs bg-background text-foreground"
          />
          {errors.emp_lastname && <p className="text-red-500 text-xs mt-1">{errors.emp_lastname}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <input
            type="email"
            name="emp_email"
            value={formData.emp_email}
            onChange={handleChange}
            className="w-full border border-border px-2 py-1.5 rounded-md text-xs bg-background text-foreground"
          />
          {errors.emp_email && <p className="text-red-500 text-xs mt-1">{errors.emp_email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium mb-1">Password</label>
          <input
            type="password"
            name="emp_password"
            value={formData.emp_password}
            onChange={handleChange}
            className="w-full border border-border px-2 py-1.5 rounded-md text-xs bg-background text-foreground"
          />
          {errors.emp_password && <p className="text-red-500 text-xs mt-1">{errors.emp_password}</p>}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-medium mb-1">Company Name</label>
          <input
            type="text"
            name="emp_company_name"
            value={formData.emp_company_name}
            onChange={handleChange}
            className="w-full border border-border px-2 py-1.5 rounded-md text-xs bg-background text-foreground"
          />
          {errors.emp_company_name && <p className="text-red-500 text-xs mt-1">{errors.emp_company_name}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-medium mb-1">Mobile Number</label>
          <input
            type="tel"
            name="emp_mobile_number"
            value={formData.emp_mobile_number}
            onChange={handleChange}
            className="w-full border border-border px-2 py-1.5 rounded-md text-xs bg-background text-foreground"
          />
          {errors.emp_mobile_number && <p className="text-red-500 text-xs mt-1">{errors.emp_mobile_number}</p>}
        </div>

        {/* Customer ID */}
        <div>
          <label className="block text-xs font-medium mb-1">Customer ID</label>
          <input
            type="number"
            name="cus_id"
            value={formData.cus_id}
            onChange={handleChange}
            className="w-full border border-border px-2 py-1.5 rounded-md text-xs bg-background text-foreground"
          />
          {errors.cus_id && <p className="text-red-500 text-xs mt-1">{errors.cus_id}</p>}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-1.5 rounded-md text-xs font-medium"
          >
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
