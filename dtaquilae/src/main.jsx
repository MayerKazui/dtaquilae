import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { ContextProvider } from "./context/ContextProvider";
import { PrimeReactProvider } from "primereact/api";
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <PrimeReactProvider>
        <RouterProvider router={router} />
      </PrimeReactProvider>
    </ContextProvider>
  </React.StrictMode>
);
