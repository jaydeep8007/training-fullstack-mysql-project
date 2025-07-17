// import { createContext, useEffect, useState } from 'react';
// import type { PropsWithChildren } from 'react';
// import { jwtDecode } from 'jwt-decode';

// // ✅ Define the decoded token shape
// interface DecodedAdminToken {
//   id: number;
//   email: string;
//   role: string;
//   exp?: number;
//   iat?: number;
// }

// // ✅ Define context type
// type AdminContextType = {
//   admin: any;
//   setAdmin: React.Dispatch<React.SetStateAction<any>>;
//   isLoading: boolean;
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   error: any;
//   setError: React.Dispatch<React.SetStateAction<any>>;
//   updateAdmin: (adminData: any) => void;
// };

// // ✅ Create context
// export const AdminDataContext = createContext<AdminContextType>({
//   admin: null,
//   setAdmin: () => {},
//   isLoading: false,
//   setIsLoading: () => {},
//   error: null,
//   setError: () => {},
//   updateAdmin: () => {},
// });

// // ✅ Context Provider
// const AdminContext = ({ children }: PropsWithChildren<{}>) => {
//   const [admin, setAdmin] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
  

//   const updateAdmin = (adminData: any) => {
//     // Just merge and add role if not already present
//     setAdmin((prev) => ({
//       ...(prev ?? {}),
//       ...adminData,
//     }));
//   };

//   // ✅ Set admin from token on first load
//   useEffect(() => {
//     const token = localStorage.getItem("adminAccessToken");
//     if (token) {
//       try {
//         const decoded = jwtDecode<DecodedAdminToken>(token);

//         // Add role from token (leave all other fields like admin_id, etc. unchanged)
//         updateAdmin({
//           token,
//           role: decoded.role,
//           email: decoded.email,
//           id: decoded.id,
//         });
//       } catch (err) {
//         console.error("❌ Failed to decode token", err);
//         localStorage.removeItem("adminAccessToken");
//       }
//     }
//   }, []);

//   console.log("admin --> ",admin)

//   const value = {
//     admin,
//     setAdmin,
//     isLoading,
//     setIsLoading,
//     error,
//     setError,
//     updateAdmin,
//   };

//   return (
//     <AdminDataContext.Provider value={value}>
//       {children}
//     </AdminDataContext.Provider>
//   );
// };

// export default AdminContext;


import { createContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedAdminToken {
  id: number;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

type AdminContextType = {
  admin: any;
  setAdmin: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: any;
  setError: React.Dispatch<React.SetStateAction<any>>;
  updateAdmin: (adminData: any) => void;
};

export const AdminDataContext = createContext<AdminContextType>({
  admin: null,
  setAdmin: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
  updateAdmin: () => {},
});

const AdminContext = ({ children }: PropsWithChildren<{}>) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAdmin = (adminData: any) => {
    setAdmin((prev) => ({
      ...(prev ?? {}),
      ...adminData,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedAdminToken>(token);

        updateAdmin({
          token,
          id: decoded.id,
          email: decoded.email,
          role: decoded.role, // this is decoded but not used for any check
        });
      } catch (err) {
        console.error("❌ Invalid token");
        localStorage.removeItem("adminAccessToken");
        setAdmin(null);
      }
    }
  }, []);

  const value = {
    admin,
    setAdmin,
    isLoading,
    setIsLoading,
    error,
    setError,
    updateAdmin,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export default AdminContext;
