import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import CustomerContext from "./context/CustomerContext.js";
import AdminContext from "./context/AdminContext.tsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminContext>
      <CustomerContext>
        <BrowserRouter>
       <PayPalScriptProvider options={{ clientId: "AexKLM4WcATxrKshRz7EsIvIorzeeD2poMtH-Cej3bt5dTzgX4zFzJr_2UaU4Pc5engAO6QdXM7S9k3x" }}>
      <App />
    </PayPalScriptProvider>
        </BrowserRouter>
      </CustomerContext>
    </AdminContext>
  </StrictMode>
);
