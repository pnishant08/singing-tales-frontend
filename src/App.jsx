import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoute";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;