import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const submit = async () => {
  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  try {
    console.log({ email, password }); // 🔍 debug

    const res = await API.post("/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/");
  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
      <div className="bg-red-100 dark:bg-zinc-800 p-6 rounded-xl w-80">
        <h2 className="text-xl mb-4 dark:text-white">Login</h2>

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
          Login
        </button>

        <p className="mt-3 text-sm dark:text-zinc-300">
          No account? <Link to="/signup" className="text-violet-500">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
