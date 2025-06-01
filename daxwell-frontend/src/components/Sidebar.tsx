/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, Link } from "react-router-dom";
import {
  FiHome,
  FiList,
  FiFilePlus,
  FiUser,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import logo from "/logo.png";
import { useState, type JSX } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen bg-white dark:bg-[#0f172a] border-r dark:border-gray-700 px-4 py-6 shadow-sm text-sm transition-all duration-300`}
    >
      {/* Logo and Collapse Toggle */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <img src={logo} alt="Logo" className="h-6 object-contain" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 dark:text-gray-300 hover:text-blue-500"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {!collapsed && (
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
          Menu
        </p>
      )}
      <nav className="flex flex-col gap-1">
        <SidebarLink
          label="Dashboard"
          icon={<FiHome />}
          path="/"
          active={location.pathname === "/"}
          collapsed={collapsed}
        />
      </nav>

      {!collapsed && (
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2 mt-4">
          Orders
        </p>
      )}
      <nav className="flex flex-col gap-1">
        <SidebarLink
          label="Orders"
          icon={<FiList />}
          path="/orders/list"
          active={location.pathname === "/orders/list"}
          collapsed={collapsed}
        />
        <SidebarLink
          label="Create Order"
          icon={<FiFilePlus />}
          path="/orders/create"
          active={location.pathname === "/orders/create"}
          collapsed={collapsed}
        />
      </nav>

      {!collapsed && (
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mt-6 mb-2">
          Support
        </p>
      )}
      <nav className="flex flex-col gap-1">
        <SidebarLink
          label="Profile"
          icon={<FiUser />}
          path="/profile"
          active={location.pathname === "/profile"}
          collapsed={collapsed}
        />
        <SidebarLink
          label="Settings"
          icon={<FiSettings />}
          path="/settings"
          active={location.pathname === "/settings"}
          collapsed={collapsed}
        />
      </nav>
    </aside>
  );
};

const SidebarLink = ({
  label,
  icon,
  path,
  active,
  collapsed,
}: {
  label: string;
  icon: JSX.Element;
  path: string;
  active: boolean;
  collapsed: boolean;
}) => (
  <Link
    to={path}
    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 ${
      active
        ? "bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-white"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
  >
    <span className="text-lg">{icon}</span>
    {!collapsed && <span>{label}</span>}
  </Link>
);

export default Sidebar;
