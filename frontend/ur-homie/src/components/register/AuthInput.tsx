type AuthInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string | null;
  showToggle?: boolean;
  showPassword?: boolean;
  onToggle?: () => void;
};

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  showToggle,
  showPassword,
  onToggle
}) => (
  <div className="relative mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
  <div className="relative">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`border w-full rounded px-4 py-2 ${error ? "border-red-500" : ""} ${showToggle ? "pr-16" : ""}`}
    />
    {showToggle && onToggle && (
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-2.5 text-sm text-green-600"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    )}
  </div>
  {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
</div>
);
