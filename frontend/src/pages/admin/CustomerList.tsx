import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
  const resultsPerPage = 10;

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

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const totalPages = Math.ceil(total / resultsPerPage);

  const toggleEmployees = (id: number) => {
    setVisibleEmployees(visibleEmployees === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 pb-24">
      <h2 className="text-2xl font-semibold mb-4 text-primary">All Customers</h2>

      <div className="overflow-x-auto shadow-md border rounded-lg mb-6">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Employees</th>
              <th className="px-4 py-2">Profile</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <>
                <tr
                  key={cust.cus_id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 font-medium">
                    {cust.cus_firstname} {cust.cus_lastname}
                  </td>
                  <td className="px-4 py-2">{cust.cus_email}</td>
                  <td className="px-4 py-2">{cust.cus_phone_number}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        cust.cus_status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cust.cus_status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleEmployees(cust.cus_id)}
                      className="text-blue-500 hover:underline text-xs"
                    >
                      {visibleEmployees === cust.cus_id
                        ? "Hide Employees"
                        : "Show Employees"}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/customer/${cust.cus_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>

                {/* Employee Expanded Row */}
                {visibleEmployees === cust.cus_id && (
                  <tr>
                    <td colSpan={6} className="bg-gray-50 px-6 py-4">
                      {cust.employee && cust.employee.length > 0 ? (
                        <div className="space-y-4">
                          {cust.employee.map((emp) => (
                            <div
                              key={emp.emp_id}
                              className="border rounded-md p-4 bg-white shadow-sm"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {emp.emp_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    📧 <span className="text-gray-600">{emp.emp_email}</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    📱 <span className="text-gray-600">{emp.emp_mobile_number}</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    🏢 <span className="text-gray-600">{emp.emp_company_name}</span>
                                  </p>
                                </div>
                                <Link
                                  to={`/employee/${emp.emp_id}`}
                                  className="text-blue-600 text-xs hover:underline mt-1"
                                >
                                  Visit Profile
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic text-xs">
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

      {/* Pagination */}
      <div className="mt-auto pt-4 border-t text-sm text-muted-foreground bg-background z-10">
        <p className="mb-2 text-center">
          Showing{" "}
          <span className="font-medium">
            {(page - 1) * resultsPerPage + 1}
          </span>{" "}
          –
          <span className="font-medium">
            {Math.min(page * resultsPerPage, total)}
          </span>{" "}
          of <span className="font-medium">{total}</span> customers
        </p>

        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded border transition ${
                page === idx + 1
                  ? "bg-primary text-white border-primary"
                  : "hover:bg-muted"
              }`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
