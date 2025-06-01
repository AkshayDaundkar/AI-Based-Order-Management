// src/components/UserModal.tsx
const UserModal = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-64">
      <div className="flex items-center gap-3">
        <img src="/avatar.jpg" alt="User" className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="font-semibold">John Doe</h2>
          <p className="text-sm text-gray-500">Admin</p>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-600">
        <p>Email:</p>
        <p>john.doe@example.com</p>
      </div>
    </div>
  );
};

export default UserModal;
