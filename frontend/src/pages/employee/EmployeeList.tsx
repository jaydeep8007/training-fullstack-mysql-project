import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

interface Employee {
  emp_id: number;
  emp_name: string;
  emp_email: string;
  emp_mobile_number: number;
  emp_company_name: string;
  customer?: {
    cus_firstname: string;
    cus_lastname: string;
    cus_email: string;
  };
  job?: {
    job_title: string;
    job_description?: string;
  };
}
const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Employee>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/employee`, {
        withCredentials: true,
      });
      const rows = res.data?.data?.rows || res.data?.data || [];
      setEmployees(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      setEmployees([]);
    }
  };

  const handleEdit = (emp: Employee) => {
    setEditEmployeeId(emp.emp_id);
    setEditData({ ...emp });
    setEditErrors({});
  };

  const cancelEdit = () => {
    setEditEmployeeId(null);
    setEditData({});
    setEditErrors({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id: number) => {
    try {
      if (!editData.emp_name || !editData.emp_email) {
        setEditErrors({ emp_name: "Name and Email are required." });
        return;
      }
      await axios.put(`${import.meta.env.VITE_BASE_URL}/employee/${id}`, editData, {
        withCredentials: true,
      });
      toast.success("Employee updated successfully.");
      cancelEdit();
      fetchEmployees();
    } catch (error: any) {
      const res = error.response?.data;
      toast.error(res?.message || "Failed to update employee.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/employee/${id}`, {
        withCredentials: true,
      });
      toast.success("Employee deleted successfully.");
      fetchEmployees();
    } catch {
      toast.error("Failed to delete employee.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

return (
  <div className="min-h-screen flex flex-col p-6 pb-24">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-primary">Employees</h2>
      <Link
        to="/admin/employees/add"
        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition"
      >
        Add
      </Link>
    </div>

    <div className="overflow-x-auto shadow border rounded-lg mb-6">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-muted text-muted-foreground uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Mobile</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <React.Fragment key={emp.emp_id}>
              <tr className="border-b odd:bg-background even:bg-muted/40 hover:bg-muted transition">
                <td className="px-4 py-3">
                  {editEmployeeId === emp.emp_id ? (
                    <input
                      type="text"
                      name="emp_name"
                      value={editData.emp_name || ""}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    emp.emp_name
                  )}
                </td>
                <td className="px-4 py-3">
                  {editEmployeeId === emp.emp_id ? (
                    <input
                      type="email"
                      name="emp_email"
                      value={editData.emp_email || ""}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    emp.emp_email
                  )}
                </td>
                <td className="px-4 py-3">
                  {editEmployeeId === emp.emp_id ? (
                    <input
                      type="text"
                      name="emp_mobile_number"
                      value={editData.emp_mobile_number || ""}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    emp.emp_mobile_number
                  )}
                </td>
                <td className="px-4 py-3">
                  {editEmployeeId === emp.emp_id ? (
                    <input
                      type="text"
                      name="emp_company_name"
                      value={editData.emp_company_name || ""}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    emp.emp_company_name
                  )}
                </td>
                <td className="px-4 py-3">
                  {emp.customer ? (
                    <div>
                      <div className="font-medium">
                        {emp.customer.cus_firstname} {emp.customer.cus_lastname}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {emp.customer.cus_email}
                      </div>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 items-center">
                    {editEmployeeId === emp.emp_id ? (
                      <>
                        <button
                          onClick={() => saveEdit(emp.emp_id)}
                          className="text-green-600 hover:text-green-800"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-800"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="hover:text-blue-600 transition"
                          title="Edit"
                          onClick={() => handleEdit(emp)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="hover:text-red-600 transition"
                          title="Delete"
                          onClick={() => handleDelete(emp.emp_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>

              {editEmployeeId === emp.emp_id &&
                Object.keys(editErrors).length > 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex justify-center items-center py-3">
                        <div className="bg-red-100 text-red-700 text-sm font-medium px-4 py-2 rounded-md border border-red-300 shadow-sm max-w-md text-center">
                          {Object.values(editErrors)[0]}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

};

export default EmployeeList;
