import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function DashboardLayout() {
  const { pathname } = useLocation();

  // 🔥 Dashboard route change → scroll top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto", 
    });
  }, [pathname]);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 ml-60 flex flex-col overflow-y-auto">
        <Topbar />

        <div className="p-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
}