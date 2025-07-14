// src/routes/AdminProtectedWrapper.tsx
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface AdminProtectedWrapperProps {
  children: ReactNode;
}

// Define your expected token payload
interface DecodedToken {
  user_id: string | number;
  email: string;
  role: string; // ✅ add this if you're sending it from backend
  exp?: number;
}

const AdminProtectedWrapper = ({ children }: AdminProtectedWrapperProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");

    if (!token) {
      navigate("/admin-login");
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("Decoded token:", decoded);

      if (decoded.role !== "admin") {
        navigate("/admin-login");
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    } catch (err) {
      console.error("Token decode failed:", err);
      navigate("/admin-login");
      setIsAuthorized(false);
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
