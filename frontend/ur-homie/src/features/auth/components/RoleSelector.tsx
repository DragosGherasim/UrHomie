import React from "react";

interface RoleSelectorProps {
  value: "client" | "service_provider" | "";
  onChange: (role: "client" | "service_provider") => void;
  error?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange, error }) => {
  const roles: ("client" | "service_provider")[] = ["client", "service_provider"];

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
      <div className="flex gap-4">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={`py-2 px-6 rounded-full border transition ${
              value === role
                ? "bg-green-500 text-white"
                : "bg-white text-green-600 hover:bg-green-100"
            }`}
          >
            {role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default RoleSelector;