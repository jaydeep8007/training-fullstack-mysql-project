import { createContext, useState } from 'react';
import type { PropsWithChildren } from 'react';

// ✅ Define the context type
type AdminContextType = {
  admin: any;
  setAdmin: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: any;
  setError: React.Dispatch<React.SetStateAction<any>>;
  updateAdmin: (adminData: any) => void;
};

// ✅ Create context
export const AdminDataContext = createContext<AdminContextType>({
  admin: null,
  setAdmin: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
  updateAdmin: () => {},
});

// ✅ Context provider component
const AdminContext = ({ children }: PropsWithChildren<{}>) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAdmin = (adminData: any) => {
    setAdmin(adminData);
  };

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
