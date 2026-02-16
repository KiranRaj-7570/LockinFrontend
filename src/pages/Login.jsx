import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { AuthForm, AuthFormDivider, AuthFormLink } from "../components/AuthForm";
import { FormField, Input, PasswordInput, Button, Alert, Progress } from "../components/ui";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    if (!password) return "Password is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const emailError = touched.email && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? "Please enter a valid email address"
    : "";

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account"
      footer="By signing in, you agree to our Terms of Service"
    >
      <AuthForm onSubmit={handleSubmit}>
        {/* Error Alert */}
        {error && <Alert variant="error">{error}</Alert>}

        {/* Email Field */}
        <FormField label="Email Address" error={emailError}>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            disabled={loading}
          />
        </FormField>

        {/* Password Field */}
        <FormField label="Password">
          <PasswordInput
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            disabled={loading}
          />
        </FormField>

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full relative overflow-hidden">
          {loading ? (
            <>
              <Progress className="absolute bottom-0 left-0 h-1 rounded-none bg-white/10" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Divider */}
        <AuthFormDivider />

        {/* Register Link */}
        <AuthFormLink
          text="Don't have an account?"
          linkText="Create one"
          to="/register"
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default Login;