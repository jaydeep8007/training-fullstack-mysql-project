// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Pencil, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface Admin {
//     admin_id: number; // ✅ Add this line
//   admin_firstname: string;
//   admin_lastname: string;
//   admin_email: string;
//   admin_phone_number: string;
//   role_id: number;
//   roles: {
//     role_name: string;
//     role_status: string;
//   };
// }

// const AdminList = () => {
//   const [admins, setAdmins] = useState<Admin[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [resultsPerPage] = useState(5);
//   const [totalAdmins, setTotalAdmins] = useState(0);

//   const navigate = useNavigate();

//  useEffect(() => {
//   const fetchAdmins = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/admin?page=${page}&results_per_page=${resultsPerPage}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
//           },
//         }
//       );
//       setAdmins(res.data?.data?.rows || []);
//       setTotalAdmins(res.data?.data?.count || 0);
//     } catch (err) {
//       console.error("Failed to fetch admins", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAdmins();
// }, [page, resultsPerPage]);

//   return (
//     <div className="p-6">
// <div className="flex items-center justify-between mb-4">
//   <h2 className="text-2xl font-bold">Admin List</h2>
//   <button
//     onClick={() => window.location.href = "/admin/user-management/add-admin"}
//     className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
//   >
//     Add User
//   </button>
// </div>

//   <div className="flex flex-col justify-between min-h-[calc(100vh-150px)] relative">
//     {/* Scrollable Table Section */}
//     <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
//       <table className="min-w-full bg-white text-sm">
//         <thead className="bg-gray-100 text-left text-xs font-semibold uppercase text-gray-700">
//           <tr>
//             <th className="px-4 py-3">First Name</th>
//             <th className="px-4 py-3">Last Name</th>
//             <th className="px-4 py-3">Email</th>
//             <th className="px-4 py-3">Phone</th>
//             <th className="px-4 py-3">Role</th>
//             <th className="px-4 py-3 text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
//                 Loading...
//               </td>
//             </tr>
//           ) : admins.length === 0 ? (
//             <tr>
//               <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
//                 No admins found.
//               </td>
//             </tr>
//           ) : (
//             admins.map((admin, index) => (
//               <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
//                 <td className="px-4 py-3">{admin.admin_firstname}</td>
//                 <td className="px-4 py-3">{admin.admin_lastname}</td>
//                 <td className="px-4 py-3">{admin.admin_email}</td>
//                 <td className="px-4 py-3">{admin.admin_phone_number}</td>
//                 <td className="px-4 py-3">{admin.roles?.role_name}</td>
            
//             <td className="px-4 py-3 text-center space-x-2">
//   <button
//     className="text-blue-600 hover:text-blue-800"
//     onClick={() => navigate(`/admin/user-management/edit-admin/${admin.admin_id}`)}
//   >
//     <Pencil size={16} />
//   </button>
//   <button className="text-red-600 hover:text-red-800">
//     <Trash2 size={16} />
//   </button>
// </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>

//     {/* Sticky Pagination Section */}
//     {totalAdmins > 0 && (
//       <div className="w-full flex justify-between items-center px-4 py-3 border-t bg-white text-sm sticky bottom-0 z-10">
//         <div className="text-gray-600">
//           Showing {(page - 1) * resultsPerPage + 1} -{" "}
//           {Math.min(page * resultsPerPage, totalAdmins)} of {totalAdmins} admins
//         </div>

//         <div className="flex gap-1">
//           {[...Array(Math.ceil(totalAdmins / resultsPerPage))].map((_, i) => {
//             const pageNum = i + 1;
//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => setPage(pageNum)}
//                 className={`px-3 py-1 border rounded text-sm ${
//                   page === pageNum
//                     ? "bg-blue-600 text-white"
//                     : "bg-white text-blue-800 hover:bg-gray-200"
//                 }`}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     )}
//   </div>
// </div>

//   );
// };

// export default AdminList;


import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Admin {
  admin_id: number;
  admin_firstname: string;
  admin_lastname: string;
  admin_email: string;
  admin_phone_number: string;
  role_id: number;
  roles: {
    role_name: string;
    role_status: string;
  };
}

const AdminList = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [totalAdmins, setTotalAdmins] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin?page=${page}&results_per_page=${resultsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
            },
          }
        );
        setAdmins(res.data?.data?.rows || []);
        setTotalAdmins(res.data?.data?.count || 0);
      } catch (err) {
        console.error("Failed to fetch admins", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [page, resultsPerPage]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-gray-600 font-bold">Admin Users</h2>
        <button
          onClick={() => navigate("/admin/user-management/add-admin")}
          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition"
        >
          Add 
        </button>
      </div>

      <div className="flex flex-col justify-between min-h-[calc(100vh-150px)] relative">
        {/* Scrollable Table Section */}
       <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
  <table className="min-w-full bg-white text-xs">
    <thead className="bg-muted text-muted-foreground uppercase text-xs tracking-wider">
      <tr className="text-left">
        <th className="px-4 py-3 whitespace-nowrap">Full Name</th>
        <th className="px-4 py-3 whitespace-nowrap">Email</th>
        <th className="px-4 py-3 whitespace-nowrap">Phone</th>
        <th className="px-4 py-3 whitespace-nowrap">Role</th>
        <th className="px-4 py-3 text-center whitespace-nowrap">Actions</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
            Loading...
          </td>
        </tr>
      ) : admins.length === 0 ? (
        <tr>
          <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
            No admins found.
          </td>
        </tr>
      ) : (
        admins.map((admin) => (
          <tr
            key={admin.admin_id}
            className="border-b border-border odd:bg-background even:bg-muted/40 hover:bg-muted transition"
          >
            <td className="px-4 py-3 align-middle whitespace-nowrap font-medium">
              {admin.admin_firstname} {admin.admin_lastname}
            </td>
            <td className="px-4 py-3 align-middle whitespace-nowrap text-blue-600 hover:underline cursor-pointer">{admin.admin_email}</td>
            <td className="px-4 py-3 align-middle whitespace-nowrap">{admin.admin_phone_number}</td>
            <td className="px-4 py-3 align-middle whitespace-nowrap">{admin.roles?.role_name}</td>
           <td className="px-4 py-3 text-center align-middle whitespace-nowrap space-x-2">
  {/* 👁️ Eye Button */}
  <button
    className="text-green-600 hover:text-green-800 hover:scale-110 transition-transform duration-200 ease-in-out"
    onClick={() =>
      navigate(`/admin/user-management/view-admin/${admin.admin_id}`)
    }
    title="View Admin"
  >
    <Eye size={16} />
  </button>

  {/* ✏️ Edit Button */}
  <button
    className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-transform duration-200 ease-in-out"
    onClick={() =>
      navigate(`/admin/user-management/edit-admin/${admin.admin_id}`)
    }
    title="Edit Admin"
  >
    <Pencil size={16} />
  </button>

  {/* 🗑️ Delete Button */}
  {admin.roles?.role_name === "Super Admin" ? (
    <button
      className="text-gray-400 cursor-not-allowed"
      disabled
      title="Super Admin cannot be deleted"
    >
      <Trash2 size={16} />
    </button>
  ) : (
    <button
      className="text-red-600 hover:text-red-800 hover:scale-110 transition-transform duration-200 ease-in-out"
      // onClick={() => handleDelete(admin.admin_id)}
      title="Delete Admin"
    >
      <Trash2 size={16} />
    </button>
  )}
</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

        {/* Sticky Pagination Section */}
        {totalAdmins > 0 && (
          <div className="w-full flex justify-between items-center px-4 py-3 border-t bg-white text-sm  z-10">
            <div className="text-gray-600">
              Showing {(page - 1) * resultsPerPage + 1} -{" "}
              {Math.min(page * resultsPerPage, totalAdmins)} of {totalAdmins} admins
            </div>

            <div className="flex gap-1">
              {[...Array(Math.ceil(totalAdmins / resultsPerPage))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 border rounded text-sm ${
                      page === pageNum
                        ?  "bg-primary text-white"
                        : "bg-white text-blue-800 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminList;
