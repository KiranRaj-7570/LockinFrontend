import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await register(name, email, password);
    navigate("/app");
  } catch (err) {
    console.error(err.response?.data?.message || "Register failed");
  }
};


  return (
    <form onSubmit={handleSubmit} className="p-6 text-white">
      <h1 className="mb-4 text-xl">Register</h1>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block mb-2 p-2 text-black"
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block mb-2 p-2 text-black"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block mb-4 p-2 text-black"
      />
      <button className="bg-green-600 px-4 py-2">Register</button>
    </form>
  );
};

export default Register;
