import { useState } from "react";
import { FiUser } from "react-icons/fi";
import UserModal from "./UserModal";
import logo from "/logo.png"; // Adjust the filename as needed

const Topbar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex justify-between items-center">
      {/* Daxwell Logo */}
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="Daxwell Logo"
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* User Icon */}
      <div className="relative">
        <button
          onClick={() => setShowModal(!showModal)}
          className="text-gray-700"
        >
          <FiUser size={24} />
        </button>
        {showModal && (
          <div className="absolute top-12 right-0 z-50">
            <UserModal />
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
