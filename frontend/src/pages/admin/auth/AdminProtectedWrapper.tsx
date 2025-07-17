// src/routes/AdminProtectedWrapper.tsx
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AdminProtectedWrapperProps {
  children: ReactNode;
}

const AdminProtectedWrapper = ({ children }: AdminProtectedWrapperProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");

    if (!token) {
      navigate("/admin-login");
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Verifying admin access...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedWrapper;
