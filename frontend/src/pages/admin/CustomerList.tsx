import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [editCustomerId, setEditCustomerId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Customer>>({});

  const resultsPerPage = 10;

  const location = useLocation();
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customer?page=${page}&results_per_page=${resultsPerPage}`,
        { withCredentials: true }
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

  const handleEdit = (cust: Customer) => {
    setEditCustomerId(cust.cus_id);
    setEditData({
      cus_firstname: cust.cus_firstname,
      cus_lastname: cust.cus_lastname,
      cus_email: cust.cus_email,
      cus_phone_number: cust.cus_phone_number,
      cus_status: cust.cus_status,
    });
  };

  const cancelEdit = () => {
    setEditCustomerId(null);
    setEditData({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/customer/${id}`,
        editData,
        { withCredentials: true }
      );
      toast.success("Customer updated successfully.");
      setEditCustomerId(null);
      fetchCustomers();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update customer.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const toggleEmployees = (id: number) => {
    setVisibleEmployees(visibleEmployees === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 pb-24">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-primary">Customers</h2>
        <Link
          to="/admin/customers/add"
          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition"
        >
          + Add
        </Link>
      </div>
      {location.pathname === "/admin/customers/add" && (
  <div className="mb-6">
    <CustomerAddForm />
  </div>
)}

      <div className="overflow-x-auto shadow border rounded-lg mb-6">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-muted text-muted-foreground uppercase text-xs tracking-wider">
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
              <tr
                key={cust.cus_id}
                className="border-b odd:bg-background even:bg-muted/40 hover:bg-muted transition"
              >
                <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap min-w-[180px]">
                  {editCustomerId === cust.cus_id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="cus_firstname"
                        value={editData.cus_firstname || ""}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-1/2"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="cus_lastname"
                        value={editData.cus_lastname || ""}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-1/2"
                        placeholder="Last Name"
                      />
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
                      href={`mailto:${cust.cus_email}?subject=Hello%20${cust.cus_firstname}&body=Hi%20${cust.cus_firstname},`}
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
                        <button
                          className="hover:text-blue-600 transition"
                          title="Edit"
                          onClick={() => handleEdit(cust)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="hover:text-red-600 transition"
                          title="Delete"
                          onClick={() => handleDelete(cust.cus_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/customer/${cust.cus_id}`}
                          className="hover:text-green-600 transition"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default CustomerList;