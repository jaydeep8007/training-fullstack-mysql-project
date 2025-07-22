import React, { useEffect, useState } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import AddEmployee from "./AddEmployee";

interface Employee {
  emp_id: number;
  emp_firstname: string;
  emp_lastname: string;
  emp_email: string;
  emp_mobile_number: number;
  emp_company_name: string;
  customer?: {
    cus_firstname: string;
    cus_lastname: string;
    cus_email: string;
  };
  job?: {
    job_name: string;
    job_description?: string;
  };
}
const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Employee>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [resultsPerPage] = useState(10); // or make it dynamic later
  const [totalEmployees, setTotalEmployees] = useState(0);

 const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem("adminAccessToken");
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/employee?page=${page}&limit=${resultsPerPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();

    const rows = resData?.data?.rows || resData?.data || [];
    const total = resData?.data?.count || 0;

    setEmployees(Array.isArray(rows) ? rows : []);
    setTotalEmployees(total);
  } catch (err) {
    console.error("Failed to fetch employees", err);
    setEmployees([]);
  }
};
  useEffect(() => {
    fetchEmployees();
  }, [page]);

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
      if (
        !editData.emp_firstname ||
        !editData.emp_lastname ||
        !editData.emp_email
      ) {
        setEditErrors({ emp_firstname: "Name and Email are required." });
        return;
      }
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/employee/${id}`,
        editData,
        {
          withCredentials: true,
        }
      );
      toast.success("Employee updated successfully.");
      cancelEdit();
      fetchEmployees();
    } catch (error: any) {
      const res = error.response?.data;
      toast.error(res?.message || "Failed to update employee.");
    }
  };

  // const handleDelete = async (id: number) => {
  //   try {
  //     await axios.delete(`${import.meta.env.VITE_BASE_URL}/employee/${id}`, {
  //       withCredentials: true,
  //     });
  //     toast.success("Employee deleted successfully.");
  //     fetchEmployees();
  //   } catch {
  //     toast.error("Failed to delete employee.");
  //   }
  // };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-6 pb-24">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-primary">Employees</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition"
        >
          Add
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4">
          <AddEmployee
            onSuccess={() => {
              setShowAddForm(false); // hide form
              fetchEmployees(); // refresh list
            }}
          />
          <div className="flex justify-end mt-2"></div>
        </div>
      )}

      <div className="overflow-x-auto shadow border border-border rounded-lg mb-6">
        <div className="relative overflow-x-auto shadow border border-border rounded-lg mb-6"></div>
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-muted text-muted-foreground uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <React.Fragment key={emp.emp_id}>
                <tr className="border-b border-border odd:bg-background even:bg-muted/40 hover:bg-muted transition">
                  <td className="px-4 py-3">
                    {editEmployeeId === emp.emp_id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="emp_firstname"
                          placeholder="First Name"
                          value={editData.emp_firstname || ""}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                        <input
                          type="text"
                          name="emp_lastname"
                          placeholder="Last Name"
                          value={editData.emp_lastname || ""}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </div>
                    ) : (
                      <span>
                        {emp.emp_firstname} {emp.emp_lastname}
                      </span>
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
                          {emp.customer.cus_firstname}{" "}
                          {emp.customer.cus_lastname}
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
  {emp.job ? (
    <div>
      <div className="font-medium">{emp.job.job_name}</div>
      {emp.job.job_description && (
        <div className="text-xs text-muted-foreground">
          {emp.job.job_description}
        </div>
      )}
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
                            onClick={() => {
                              setEmployeeToDelete(emp);
                              setShowDeleteConfirm(true);
                            }}
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

      {totalEmployees > 0 && (
        <div className="mt-auto w-full flex justify-between items-center px-4 py-3 border-t border-border bg-background sticky bottom-0 z-40">
          {/* Left: Showing info */}
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * resultsPerPage + 1} -{" "}
            {Math.min(page * resultsPerPage, totalEmployees)} of{" "}
            {totalEmployees} employees
          </div>

          {/* Right: Pagination buttons */}
          <div className="flex space-x-1">
            {[...Array(Math.ceil(totalEmployees / resultsPerPage))].map(
              (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded text-sm border ${
                      page === pageNum
                        ? "bg-primary text-white"
                        : "bg-white text-blue-800 hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {showDeleteConfirm && employeeToDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-background rounded-xl shadow-lg p-6 w-full max-w-md border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Confirm Delete
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {employeeToDelete.emp_firstname} {employeeToDelete.emp_lastname}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setEmployeeToDelete(null);
                }}
                className="px-4 py-1.5 text-sm border border-border rounded-md hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(
                      `${import.meta.env.VITE_BASE_URL}/employee/${
                        employeeToDelete.emp_id
                      }`,
                      { withCredentials: true }
                    );
                    toast.success("Employee deleted successfully.");
                    fetchEmployees();
                  } catch {
                    toast.error("Failed to delete employee.");
                  } finally {
                    setShowDeleteConfirm(false);
                    setEmployeeToDelete(null);
                  }
                }}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
