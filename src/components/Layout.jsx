import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LandingNavbar from "./LandingNavbar";
import DashboardNavbar from "./DashboardNavbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const STORAGE_KEY = "sidebar:collapsed";

export default function Layout({ variant = "landing", withFooter = true }) {
  const isDashboard = variant === "dashboard";
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "1"
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  if (!isDashboard) {
    return (
      <div className="flex min-h-screen flex-col">
        <LandingNavbar />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
        {withFooter && <Footer />}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar onToggleSidebar={() => setCollapsed((v) => !v)} />
      <div className="flex flex-1">
        <Sidebar collapsed={collapsed} />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex flex-1 flex-col">
            <Outlet />
          </main>
          {withFooter && <Footer />}
        </div>
      </div>
    </div>
  );
}
