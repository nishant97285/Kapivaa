import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardRoutes from "./DashboardRoutes";
import Home from "../pages/Home";
import Login from "../components/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard nested routes */}
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
    </Routes>
  );
};

export default AppRoutes;