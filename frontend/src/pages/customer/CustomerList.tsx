import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation} from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Users2,
  Trash2,
  Eye,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import CustomerAddForm from "./AddCustomer";
import { customerEditSchema } from "@/helper/updateCustomerValidation";
import { AnimatePresence, motion } from "framer-motion";

interface Employee {
  emp_id: number;
  emp_name: string;
  emp_email: string;
  emp_mobile_number: number;
  emp_company_name: string;
}

interface Customer {
  cus_id: number;
  cus_firstname: string;
  cus_lastname: string;
  cus_email: string;
  cus_phone_number: string;
  cus_status: "active" | "inactive";
  employee?: Employee[];
}

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [visibleEmployees, setVisibleEmployees] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [editCustomerId, setEditCustomerId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Customer>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const resultsPerPage = 10;

  const location = useLocation();
  // const navigate = useNavigate();

  const fetchCustomers = async () => {
  try {
    const token = localStorage.getItem("adminAccessToken");

    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/customer?page=${page}&results_per_page=${resultsPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token in header
        },
      }
    );

    setCustomers(res.data.data.rows);
    setTotal(res.data.data.count);
  } catch (err) {
    console.error("Failed to fetch customers", err);
  }
};

  const handleDelete = (cus_id: number) => {
    setShowDeleteModal(true);
    setSelectedCustomerId(cus_id);
  };

  const confirmDelete = async () => {
    if (selectedCustomerId === null) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/customer/${selectedCustomerId}`,
        { withCredentials: true }
      );
      fetchCustomers();
      setShowDeleteModal(false);
      toast.success("Customer deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      setShowDeleteModal(false);
      toast.error("Failed to delete customer. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };
  const cancelEdit = () => {
    setEditCustomerId(null);
    setEditData({});
    setEditErrors({});
  };

  const handleEdit = (cust: Customer) => {
    setEditCustomerId(cust.cus_id);
    setEditData({
      cus_firstname: cust.cus_firstname,
      cus_lastname: cust.cus_lastname,
      cus_email: cust.cus_email,
      cus_phone_number: cust.cus_phone_number,
      cus_status: cust.cus_status,
    });
    setEditErrors({});
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const saveEdit = async (id: number) => {
    try {
      const result = customerEditSchema.safeParse(editData);

      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setEditErrors(newErrors);
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/customer/${id}`,
        editData,
        { withCredentials: true }
      );
      toast.success("Customer updated successfully.");
      setEditCustomerId(null);
      setEditErrors({});
      fetchCustomers();
    } catch (error: any) {
      const res = error.response?.data;
      toast.error(res?.message || "Failed to update customer.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, location.pathname]); // ⬅️ added location.pathname here

  const toggleEmployees = (id: number) => {
    setVisibleEmployees(visibleEmployees === id ? null : id);
  };

  return (
   <AnimatePresence>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }} // <-- this enables smooth disappear
            transition={{ duration: 0.3 }}
    className="min-h-screen flex flex-col p-6 pb-24">
  {location.pathname !== "/admin/customers/add" && (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl text-gray-500 font-semibold  ">Customers</h2>
    <Link
      to="/admin/customers/add"
      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition"
    >
      Add
    </Link>
  </div>
)}

{location.pathname === "/admin/customers/add" && (
  <div className="mb-6">
    <CustomerAddForm />
  </div>
)}


      <div className="overflow-x-auto shadow border border-border rounded-lg mb-6">
        <table className="min-w-full text-xs text-left  border-collapse">
          <thead className="bg-muted  text-muted-foreground uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Employees</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <>
                <tr
                  key={cust.cus_id}
                  className="border-b border-border odd:bg-background even:bg-muted/40 hover:bg-muted transition"
                >
                  <td className="px-4 py-3 font-normal text-foreground whitespace-nowrap min-w-[180px]">
                    {editCustomerId === cust.cus_id ? (
                      <div className="flex gap-2">
                        <div className="w-1/2">
                          <input
                            type="text"
                            name="cus_firstname"
                            value={editData.cus_firstname || ""}
                            onChange={handleEditChange}
                            className={`border px-2 py-1 rounded w-full ${
                              editErrors.cus_firstname ? "border-red-500" : ""
                            }`}
                            placeholder="First Name"
                          />
                          {/* {editErrors.cus_firstname && (
                            <p className="text-xs text-red-500 mt-1">
                              {editErrors.cus_firstname}
                            </p>
                          )} */}
                        </div>
                        <div className="w-1/2">
                          <input
                            type="test"
                            name="cus_lastname"
                            value={editData.cus_lastname || ""}
                            onChange={handleEditChange}
                            className={`border px-2 py-1 rounded w-full ${
                              editErrors.cus_lastname ? "border-red-500" : ""
                            }`}
                          />
                          {/* {editErrors.cus_email && (
                            <p className="text-xs text-red-500 mt-1">
                              {editErrors.cus_email}
                            </p>
                          )} */}
                        </div>
                      </div>
                    ) : (
                      `${cust.cus_firstname} ${cust.cus_lastname}`
                    )}
                  </td>
<td className="px-4 py-3">
  {editCustomerId === cust.cus_id ? (
    <input
      type="email"
      name="cus_email"
      value={editData.cus_email || ""}
      onChange={handleEditChange}
      className="border px-2 py-1 rounded w-full"
    />
  ) : (
    <a
      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        cust.cus_email
      )}&su=${encodeURIComponent(`Hello ${cust.cus_firstname}`)}&body=${encodeURIComponent(
        `Hi ${cust.cus_firstname},`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      {cust.cus_email}
    </a>
  )}
</td>


                  <td className="px-4 py-3">
                    {editCustomerId === cust.cus_id ? (
                      <input
                        type="text"
                        name="cus_phone_number"
                        value={editData.cus_phone_number || ""}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      cust.cus_phone_number
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editCustomerId === cust.cus_id ? (
                      <select
                        name="cus_status"
                        value={editData.cus_status || "active"}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : cust.cus_status === "active" ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <CheckCircle className="w-4 h-4" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                        <XCircle className="w-4 h-4" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleEmployees(cust.cus_id)}
                      className="text-blue-500 hover:underline text-xs inline-flex items-center gap-1"
                    >
                      <Users2 className="w-4 h-4" />
                      {visibleEmployees === cust.cus_id ? "Hide" : "Show"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                      {editCustomerId === cust.cus_id ? (
                        <>
                          <button
                            onClick={() => saveEdit(cust.cus_id)}
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
  <Link
    to={`/customer/${cust.cus_id}`}
    className="text-green-500 hover:text-green-600 hover:scale-110 transition-transform duration-200 ease-in-out"
    title="View Profile"
  >
    <Eye className="w-4 h-4" />
  </Link>

  <button
    className="text-blue-500 hover:text-blue-600 hover:scale-110 transition-transform duration-200 ease-in-out"
    title="Edit"
    onClick={() => handleEdit(cust)}
  >
    <Pencil className="w-4 h-4" />
  </button>

  <button
    className="text-red-500 hover:text-red-600 hover:scale-110 transition-transform duration-200 ease-in-out"
    title="Delete"
    onClick={() => handleDelete(cust.cus_id)}
  >
    <Trash2 className="w-4 h-4" />
  </button>
</>

                      )}
                    </div>
                  </td>
                </tr>
                {/* Common Error Message */}
                {editCustomerId === cust.cus_id &&
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

                {/* Conditional Employee Row */}
                {visibleEmployees === cust.cus_id && (
                  <tr className="bg-muted/10">
                    <td colSpan={6} className="px-6 py-3">
                      {cust.employee && cust.employee.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {cust.employee.map((emp) => (
                            <div
                              key={emp.emp_id}
                              className="border border-border bg-muted rounded-md p-3 shadow-sm text-sm text-muted-foreground hover:bg-muted/60 transition"
                            >
                              <div className="font-medium text-foreground text-sm mb-1">
                                {emp.emp_name}
                              </div>
                              <div className="space-y-1 leading-5">
                                <div>
                                  <span className="text-xs font-medium text-foreground">
                                    Email:
                                  </span>{" "}
                                  {emp.emp_email}
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-foreground">
                                    Mobile:
                                  </span>{" "}
                                  {emp.emp_mobile_number}
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-foreground">
                                    Company:
                                  </span>{" "}
                                  {emp.emp_company_name}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs italic text-gray-500">
                          No employees assigned.
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Info & Controls */}
      <div className="mt-auto w-full flex justify-between items-center px-4 py-3 border-t border-border bg-background  z-40">
        {/* Left: Showing data info */}
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * resultsPerPage + 1} -{" "}
          {Math.min(page * resultsPerPage, total)} of {total} customers
        </div>

        {/* Right: Page numbers */}
        <div className="flex space-x-1">
          {[...Array(Math.ceil(total / resultsPerPage))].map((_, index) => {
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
          })}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this customer?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
    </AnimatePresence>
  );
};

export default CustomerList;
