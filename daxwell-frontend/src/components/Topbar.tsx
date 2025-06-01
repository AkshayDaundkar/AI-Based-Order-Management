import { FiBell, FiSearch, FiMoon, FiSun } from "react-icons/fi";
import avatar from "/avatar.jpg";
import { useDarkMode } from "../hooks/useDarkMode";

const Topbar = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <header className="w-full h-16 bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between shadow-sm">
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
      <div className="flex items-center gap-6">
        {/* Toggle Theme Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-500 dark:text-gray-300 hover:text-blue-500"
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <FiBell className="text-gray-500 dark:text-gray-300" size={18} />
        <img
          src={avatar}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Topbar;
