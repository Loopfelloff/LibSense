import { useState } from "react";
import Navbar from "../components/Dashboard-Components/Navbar";
import Sidebar from "../components/Dashboard-Components/Sidebar";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
      <>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
      />

      <div className="pt-13.25 flex-row grow justify-start">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 h-full lg:pl-56 grow ">
          <Outlet />
        </main>
      </div>
      </>
  );
};
