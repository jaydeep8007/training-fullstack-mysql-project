import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import CustomerContext from "./context/CustomerContext.js";
import AdminContext from "./context/AdminContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminContext>
      <CustomerContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CustomerContext>
    </AdminContext>
  </StrictMode>
);
