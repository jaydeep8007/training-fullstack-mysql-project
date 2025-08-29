// // Example success page
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";

// export default function PaypalSuccessPage() {
//   const location = useLocation();

//   useEffect(() => {
//     const query = new URLSearchParams(location.search);
//     const orderId = query.get("token");

//     if (orderId) {
//       axios.post("http://localhost:3000/api/v1/payment/paypal/capture-paypal-order", {
//         orderId,
//       })
//       .then(res => {
//         console.log("✅ Payment captured:", res.data);
//       })
//       .catch(err => {
//         console.error("❌ Capture failed:", err);
//       });
//     }
//   }, [location]);

//   return <h2>PayPal Payment Success ✅</h2>;
// }

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaypalSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const payerId = searchParams.get("PayerID");

  useEffect(() => {
    if (token && payerId) {
      axios.post("http://localhost:3000/api/v1/payment/paypal/capture-paypal-order", { orderId: token })
        .then((res) => {
          console.log("✅ Capture Success:", res.data);
        })
        .catch((err) => {
          console.error("❌ Capture Failed:", err);
        });
    }
  }, [token, payerId]);

  return <div>Processing PayPal Payment...</div>;
};

export default PaypalSuccessPage;

