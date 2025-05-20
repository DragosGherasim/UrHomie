import { useState } from "react";
import { Link } from "react-router-dom";

import { AuthInput } from "../../components/register/AuthInput";
import { validateEmail, validateMinLength } from "../../utils/validations";
import { useAuth } from "../../context/AuthContext";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    if (!validateEmail(formData.email)) {
      setError("Invalid email");
      return false;
    }
    if (!validateMinLength(formData.password, 6)) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    login(formData.email, formData.password, (message) => {
      setError(message);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <form
        onSubmit={handleSubmitLogin}
        noValidate
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <AuthInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-40 mt-6 mx-auto block"
        >
          Log In
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 hover:text-green-700 font-semibold underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;