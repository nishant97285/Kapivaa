import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardRoutes from "./DashboardRoutes";
import Home from "../pages/Home";
import Login from "../components/Login";
import Register from "../pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard nested routes */}
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
    </Routes>
  );
};

export default AppRoutes;