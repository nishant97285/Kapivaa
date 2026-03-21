import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="page-content">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;