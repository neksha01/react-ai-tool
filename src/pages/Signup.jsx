import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await API.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
      <div className="bg-red-100 dark:bg-zinc-800 p-6 rounded-xl w-80">
        <h2 className="text-xl mb-4 dark:text-white">Signup</h2>

        <input
          className="w-full mb-3 p-2 rounded bg-violet-200"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full mb-3 p-2 rounded bg-violet-200"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-3 p-2 rounded bg-violet-200"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-violet-600 text-white p-2 rounded"
        >
          Signup
        </button>

        <p className="mt-3 text-sm dark:text-zinc-300">
          Already have an account? <Link to="/login" className="text-violet-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
