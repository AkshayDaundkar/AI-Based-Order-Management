import { useState, useEffect } from "react";
import { FiBell, FiSearch, FiMoon, FiSun } from "react-icons/fi";
import avatar from "/avatar.jpg";
import { useDarkMode } from "../hooks/useDarkMode";
import UserModal from "./UserModal";
import { useNotificationLog } from "../context/NotificationContext";

const Topbar = () => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const { log } = useNotificationLog();

  const toggleUserModal = () => setShowUserModal((prev) => !prev);
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setHasUnread(false); // mark as read
  };

  // Set red dot when new notification appears
  useEffect(() => {
    if (log.length > 0) {
      setHasUnread(true);
    }
  }, [log]);

  return (
    <header className="w-full h-16 bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between shadow-sm relative">
      {/* Search */}
      <div className="flex items-center gap-2 w-1/2">
        <FiSearch className="text-gray-400 dark:text-gray-300" />
        <input
          type="text"
          placeholder="Search or type command..."
          className="w-full px-2 py-2 bg-transparent outline-none text-sm text-gray-700 dark:text-white"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6 relative">
        {/* Toggle Theme Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-500 dark:text-gray-300 hover:text-blue-500"
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={toggleNotifications} className="relative">
            <FiBell
              className="text-gray-500 dark:text-gray-300 cursor-pointer"
              size={18}
            />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg w-72 p-4 z-50">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white mb-2">
                Recent Actions
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 max-h-64 overflow-y-auto">
                {log.length === 0 ? (
                  <li className="italic text-gray-400">No activity yet</li>
                ) : (
                  log.map((n, idx) => (
                    <li
                      key={idx}
                      className="text-xs border-b border-gray-200 dark:border-gray-700 pb-1"
                    >
                      ✅ {n.message}
                      <br />
                      <span className="text-gray-400 text-xs">
                        {n.timestamp}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative">
          <img
            src={avatar}
            alt="User"
            onClick={toggleUserModal}
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
          />
          {showUserModal && (
            <div className="absolute right-0 mt-2 z-50">
              <UserModal />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
