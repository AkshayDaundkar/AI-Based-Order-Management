// src/components/Topbar.tsx
import { useState } from "react";
import { FiUser } from "react-icons/fi";
import UserModal from "./UserModal";

const Topbar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white shadow p-4 flex justify-end items-center">
      <button
        onClick={() => setShowModal(!showModal)}
        className="text-gray-700 relative"
      >
        <FiUser size={24} />
      </button>
      {showModal && (
        <div className="absolute top-16 right-4 z-50">
          <UserModal />
        </div>
      )}
    </div>
  );
};

export default Topbar;
