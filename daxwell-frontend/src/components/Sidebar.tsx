// src/components/Sidebar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiFilePlus, FiList, FiMenu } from "react-icons/fi";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`bg-gray-800 text-white ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 h-full`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-lg font-bold"></h1>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-white">
          <FiMenu />
        </button>
      </div>
      <nav className="flex flex-col gap-2 p-2">
        <Link
          to="/"
          className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
        >
          <FiHome />
          {!collapsed && <span>Home</span>}
        </Link>

        {/* Order section */}
        <div className="mt-2">
          {!collapsed && <p className="px-2 text-xs text-gray-400">Orders</p>}
          <Link
            to="/orders/create"
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
          >
            <FiFilePlus />
            {!collapsed && <span>Create</span>}
          </Link>
          <Link
            to="/orders/list"
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
          >
            <FiList />
            {!collapsed && <span>List</span>}
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
