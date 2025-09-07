import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { landingHero } from "../../assets/index.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [phase, setPhase] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    rollNo: "",
    gender: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent spaces in username
    if (name === "username") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\s/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNextPhase = (e) => {
    e.preventDefault();
    setError("");

    // Validate phase 1 fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.rollNo ||
      !formData.gender
    ) {
      setError("Please fill all required fields");
      return;
    }

    setPhase(2);
  };

  const handlePrevPhase = (e) => {
    e.preventDefault();
    setPhase(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate phase 2 fields
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Create FormData object
      const submitData = new FormData();
      submitData.append("username", formData.username);
      submitData.append(
        "fullName",
        `${formData.firstName} ${formData.lastName}`
      );
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("rollNo", formData.rollNo);
      submitData.append("gender", formData.gender);

      const result = await register(submitData);

      if (result.success) {
        // Navigate to OTP verification page with email
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show loading skeleton while checking auth status
  if (authLoading) {
    return (
      <div className="font-Jost flex min-h-screen justify-center items-center text-gray-800 bg-gray-50">
        <div className="w-full max-w-md p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Create an account to join the community!
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={phase === 1 ? handleNextPhase : handleSubmit}
          >
            {phase === 1 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="font-medium text-gray-600"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      type="text"
                      placeholder="John"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      className="font-medium text-gray-600"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      type="text"
                      placeholder="Doe"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium text-gray-600" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="font-medium text-gray-600"
                      htmlFor="rollNo"
                    >
                      Roll No
                    </label>
                    <input
                      id="rollNo"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      className="mt-1 w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      type="text"
                      placeholder="22CSE00"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      className="font-medium text-gray-600"
                      htmlFor="gender"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 w-full bg-white px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      required
                      disabled={loading}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-Saira text-lg font-semibold text-white bg-orange-500 rounded-lg py-3 px-4 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300"
                >
                  Next
                </button>
              </>
            ) : (
              <>
                <div>
                  <label
                    className="font-medium text-gray-600"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="mt-1 w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    type="text"
                    placeholder="johndoe"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    className="font-medium text-gray-600"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      className="w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="font-medium text-gray-600"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      className={`w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border transition-all ${
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-orange-500"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        Passwords do not match.
                      </p>
                    )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handlePrevPhase}
                    disabled={loading}
                    className="w-full font-Saira text-lg font-semibold text-gray-700 bg-gray-200 rounded-lg py-3 px-4 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full font-Saira text-lg font-semibold text-white bg-orange-500 rounded-lg py-3 px-4 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:bg-gray-400"
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;