import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider";

const STRICT_MODE = import.meta.env.VITE_REACT_APP_ENABLE_STRICT_MODE;
const rootComponent =
  STRICT_MODE === "true" ? (
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  ) : (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );

ReactDOM.createRoot(document.getElementById("root")).render(rootComponent);
