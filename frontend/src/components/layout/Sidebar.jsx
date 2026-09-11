import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings,
  LogOut,
  Radio,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    path: "/products",
    icon: Package,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: Boxes,
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: Truck,
  },
  {
    label: "Stock In",
    path: "/stock-in",
    icon: ArrowDownToLine,
  },
  {
    label: "Stock Out",
    path: "/stock-out",
    icon: ArrowUpFromLine,
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
  },
  {
    label: "Live Studio",
    path: "/live-studio",
    icon: Radio,
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">J</div>

        <div>
          <h2>JUMANJI STORE</h2>
          <span>Half Price products</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-title">MAIN MENU</p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <p className="nav-title">SYSTEM</p>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;