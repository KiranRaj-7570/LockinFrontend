import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(name, email, password);
      navigate("/app");
    } catch (err) {
      console.error(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:max-h-screen flex items-center justify-center bg-linear-to-r from-red-500 to-orange-500 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#222] shadow-black shadow-lg rounded-xl p-6 saira space-y-5"
      >
        <h1 className="text-2xl font-semibold text-orange-500 saira text-center">
          Create account
        </h1>

        <div>
          <label className="text-sm">Name</label>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md bg-[#1c1c1c] border border-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md bg-[#1c1c1c] border border-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="text-sm ">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md bg-[#1c1c1c] border border-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-500 transition rounded-md py-2 font-medium disabled:opacity-60"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
