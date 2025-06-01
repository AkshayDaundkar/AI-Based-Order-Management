type MultiSelectProps = {
  label: string;
  options: string[];
  values: string[];
  onChange: (updated: string[]) => void;
};

const MultiSelect = ({
  label,
  options,
  values,
  onChange,
}: MultiSelectProps) => {
  const toggle = (option: string) => {
    onChange(
      values.includes(option)
        ? values.filter((v) => v !== option)
        : [...values, option]
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
          >
            <input
              type="checkbox"
              value={opt}
              checked={values.includes(opt)}
              onChange={() => toggle(opt)}
              className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-blue-600 focus:ring-blue-500"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;
