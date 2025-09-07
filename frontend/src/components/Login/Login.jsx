import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { landingHero } from "../../assets/index.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [formData, setFormData] = React.useState({
    emailOrUsername: "",
    password: "",
  });

  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.emailOrUsername || !formData.password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      // Determine if input is email or username
      const isEmail = formData.emailOrUsername.includes("@");
      const loginData = {
        password: formData.password,
        ...(isEmail
          ? { email: formData.emailOrUsername }
          : { username: formData.emailOrUsername }),
      };

      const result = await login(loginData);

      if (result.success) {
        // Navigate to home page
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-Jost flex min-h-screen text-gray-800 bg-gray-50">
      {/* Left Section: Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-orange-100/50 p-12">
        <img
          src={landingHero}
          alt="Community illustration"
          className="w-full h-auto object-contain max-w-md"
        />
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="font-Saira text-4xl text-orange-500 font-bold">
              <span className="text-gray-700">SIT</span>Coders
            </div>
            <p className="text-gray-500 mt-2">
              Welcome back! Please log in to your account.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="font-medium text-gray-600"
                htmlFor="emailOrUsername"
              >
                Email or Username
              </label>
              <input
                id="emailOrUsername"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleInputChange}
                className="mt-1 w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                type="text"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline">
                <label className="font-medium text-gray-600" htmlFor="password">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-orange-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-Saira text-lg font-semibold text-white bg-orange-500 rounded-lg py-3 px-4 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;