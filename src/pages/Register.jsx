import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { AuthForm, AuthFormDivider, AuthFormLink } from "../components/AuthForm";
import { FormField, Input, PasswordInput, Button, Alert, Progress } from "../components/ui";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    if (password.length < 6) return "Password must be at least 6 characters";
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
      await register(name, email, password);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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

  const passwordError = touched.password && password.length > 0 && password.length < 6
    ? "Password must be at least 6 characters"
    : "";

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us and get started today"
      footer="By creating an account, you agree to our Terms of Service"
    >
      <AuthForm onSubmit={handleSubmit}>
        {/* Error Alert */}
        {error && <Alert variant="error">{error}</Alert>}

        {/* Name Field */}
        <FormField label="Full Name">
          <Input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur("name")}
            disabled={loading}
          />
        </FormField>

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
        <FormField label="Password" error={passwordError}>
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
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Divider */}
        <AuthFormDivider />

        {/* Login Link */}
        <AuthFormLink
          text="Already have an account?"
          linkText="Sign In"
          to="/login"
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default Register;