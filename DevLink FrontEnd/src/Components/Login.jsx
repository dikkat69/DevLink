import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-md">

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            DevLink
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            {isLoginForm
              ? "Welcome back. Continue your journey."
              : "Create your account and start matching."}
          </p>
        </div>

        <div className="space-y-4">

          {!isLoginForm && (
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-pink-500 outline-none text-white"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-pink-500 outline-none text-white"
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email address"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-pink-500 outline-none text-white"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-pink-500 outline-none text-white pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg py-2 text-center">
            {error}
          </p>
        )}

        <button
          onClick={isLoginForm ? handleLogin : handleSignUp}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {isLoginForm ? "Login" : "Create Account"}
        </button>

        <div className="text-center mt-6">
          <p
            className="text-gray-400 hover:text-white cursor-pointer text-sm transition"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm
              ? "New here? Create an account"
              : "Already have an account? Login"}
          </p>
        </div>

      </div>

      <p className="text-center text-gray-500 text-xs mt-6">
        Built for developers 🚀
      </p>
    </div>
  </div>
);
};

export default Login;