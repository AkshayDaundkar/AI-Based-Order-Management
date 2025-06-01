type InputProps = {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
  type?: string;
};

const Input = ({ label, value, onChange, type = "text" }: InputProps) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) =>
        onChange(type === "number" ? Number(e.target.value) : e.target.value)
      }
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Input;
