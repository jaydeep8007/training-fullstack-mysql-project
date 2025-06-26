import { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CustomerDataContext } from "../context/CustomerContext";

const CustomerProfile = () => {
  const { customer, updateCustomer, setIsLoading, setError } = useContext(CustomerDataContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem("customerAccessToken");
        if (!token) throw new Error("Missing token");

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/customer/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        updateCustomer(response.data.data.customer);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError("Session expired. Please login again.");
        navigate("/customer-login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("customerAccessToken");

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/customer/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      updateCustomer(null);
      localStorage.removeItem("customerAccessToken");
      navigate("/customer-login");
    } catch (error: any) {
      console.error("Logout error:", error);
      const errMsg = error?.response?.data?.message || "Logout failed";
      setError(errMsg);
      alert(errMsg);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Customer Profile</h2>

      {customer ? (
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="mb-2"><strong>Name:</strong> {customer.cus_firstname} {customer.cus_lastname}</p>
          <p className="mb-2"><strong>Email:</strong> {customer.cus_email}</p>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="text-gray-600">Loading profile...</p>
      )}
    </div>
  );
};

export default CustomerProfile;
