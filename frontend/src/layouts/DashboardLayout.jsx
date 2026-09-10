import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;