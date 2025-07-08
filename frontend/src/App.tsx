// App.tsx
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { appRoutes } from "./routes";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";


function App() {
  const routes = useRoutes(appRoutes);

  return (
    <>
      {routes}

      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
