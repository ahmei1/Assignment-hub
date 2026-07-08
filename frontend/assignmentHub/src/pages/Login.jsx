import { Link } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const mockUser =
      email === "lecturer@test.com"
        ? {
            id: 1,
            name: "Dr Smith",
            role: "lecturer",
          }
        : {
            id: 2,
            name: "John Doe",
            role: "student",
          };
    login(mockUser);

    if (mockUser.role === "lecturer") {
      navigate("/lecturerDashboard");
    } else {
      navigate("/studentDashboard");
    }
  };
  return (
    <AuthLayout>
      <div className="flex flex-col justify-center p-60 gap-5  text-[#5A5F82] ">
        <h1 className="text-5xl mb-2">Welcome back!</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col align-middle items-baseline mt-3 "
        >
          <label className="mb-3 text-2xl">Email</label>
          <input
            className="p-3 w-full border mb-4 rounded-2xl"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="mb-3 text-2xl">Password</label>
          <input
            className="p-3 w-full border mb-4 rounded-2xl"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 w-full text-amber-50 text-[20px] border bg-[#252736] hover:bg-[#41455E] transform transition-all duration-200 p-3 cursor-pointer rounded-3xl"
          >
            Login
          </button>
        </form>
        <div>
          <p>
            don't have an account?{" "}
            <Link className="text-blue-700" to="/register">
              register
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
