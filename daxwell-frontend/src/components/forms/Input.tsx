type InputProps = {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
  type?: string;
};

const Input = ({ label, value, onChange, type = "text" }: InputProps) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) =>
        onChange(type === "number" ? Number(e.target.value) : e.target.value)
      }
      className="w-full border rounded px-3 py-2"
    />
  </div>
);

export default Input;
