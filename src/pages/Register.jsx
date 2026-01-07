import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-500 via-orange-500 to-yellow-500 px-4 py-8 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Join us and get started today
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-8 space-y-5 border border-white/10"
        >
          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm animate-fadeIn">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name")}
              className="w-full rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 px-4 py-3 text-white placeholder-slate-500 text-sm transition-all duration-200"
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              className="w-full rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 px-4 py-3 text-white placeholder-slate-500 text-sm transition-all duration-200"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                className="w-full rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 px-4 py-3 pr-12 text-white placeholder-slate-500 text-sm transition-all duration-200"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                tabIndex="-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {touched.password && password.length > 0 && password.length < 6 && (
              <p className="text-xs text-orange-400 mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-orange-500/50 text-base sm:text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-xs text-slate-400 px-2">or</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200"
            >
              Sign In
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-white/50 mt-6">
          By creating an account, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Register;