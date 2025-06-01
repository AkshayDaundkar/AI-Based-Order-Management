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
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className="text-sm flex gap-1 items-center">
            <input
              type="checkbox"
              value={opt}
              checked={values.includes(opt)}
              onChange={() => toggle(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;
