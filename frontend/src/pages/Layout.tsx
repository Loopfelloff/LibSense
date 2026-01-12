import { useState } from "react";
import Navbar from "../components/Dashboard-Components/Navbar";
import Sidebar from "../components/Dashboard-Components/Sidebar";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
      />

      <div className="pt-13.25 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:pl-56">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
