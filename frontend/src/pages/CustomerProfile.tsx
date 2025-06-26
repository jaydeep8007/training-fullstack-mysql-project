import { useEffect, useContext } from "react";
import axios from "axios";
import { CustomerDataContext } from "../context/CustomerContext";
import { useNavigate } from "react-router-dom";

const CustomerProfile = () => {
  const { customer, updateCustomer, setIsLoading, setError } = useContext(CustomerDataContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Missing token");

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/customer/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // optional if needed for cookie (refresh token)
          }
        );

        updateCustomer(response.data.data.customer);
      } catch (err) {
        setError("Session expired. Please login again.");
        navigate("/customer-login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Customer Profile</h2>
      {customer ? (
        <div className="mt-4">
          <p>Name: {customer.cus_firstname} {customer.cus_lastname}</p>
          <p>Email: {customer.cus_email}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default CustomerProfile;
