import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { createChangeHandler } from "../../utils/formUtils";
import { AuthInput } from "../../components/auth/AuthInput";
import { validateLoginForm } from "../../utils/validation/loginFormValidation";
import FormOverlaySpinner from "../../components/ui/FormOverlaySpinner";

const LoginForm: React.FC = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = createChangeHandler(formData, setFormData);

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateLoginForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    login(formData.email, formData.password, (message) => {
      setError(message);
      setIsSubmitting(false);
    });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-green-50">
      <form
        onSubmit={handleSubmitLogin}
        noValidate
        className="bg-white p-8 rounded shadow-md w-full max-w-md relative z-0"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">Login</h2>

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
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          showToggle={true}
          showPassword={showPassword}
          onToggle={() => setShowPassword((prev) => !prev)}
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

      {isSubmitting && <FormOverlaySpinner text="Logging in..." color="green" />}
    </div>
  );
};

export default LoginForm;

