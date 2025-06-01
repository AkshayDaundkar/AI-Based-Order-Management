// src/components/UserModal.tsx
const UserModal = () => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 w-64 text-gray-800 dark:text-gray-200">
      <div className="flex items-center gap-3">
        <img src="/avatar.jpg" alt="User" className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            John Doe
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Admin</p>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
        <p>Email: john.doe@example.com</p>
        <p>Phone: +1 234 567 890</p>
        <p>Department: IT</p>
      </div>
    </div>
  );
};

export default UserModal;
