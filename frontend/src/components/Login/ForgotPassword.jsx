import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaSpinner, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { landingHero } from "../../assets/index.js";

function ForgotPassword() {
  const {
    sendResetPasswordOtp,
    verifyResetPasswordOtp,
    resetPassword,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const result = await sendResetPasswordOtp(formData.email);

      if (result.success) {
        setSuccess("OTP sent to your email address");
        setStep(2);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.otp) {
      setError("Please enter the OTP");
      setLoading(false);
      return;
    }

    if (formData.otp.length !== 6) {
      setError("OTP must be 6 digits");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyResetPasswordOtp(formData.email, formData.otp);

      if (result.success) {
        setSuccess("OTP verified successfully");
        setStep(3);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill all password fields");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(
        formData.newPassword,
        formData.confirmPassword
      );

      if (result.success) {
        setSuccess(
          "Password reset successfully! Redirecting to login..."
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="text-center">
              <FaLock className="mx-auto text-orange-500 mb-3" size={32} />
              <h2 className="text-2xl font-bold text-gray-800">
                Forgot Password
              </h2>
              <p className="text-gray-500 mt-1">
                Enter your email to receive a verification code.
              </p>
            </div>

            <div>
              <label
                className="font-medium text-gray-600"
                htmlFor="email"
              >
                Email Address
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

            <button
              type="submit"
              disabled={loading}
              className="w-full font-Saira text-lg font-semibold text-white bg-orange-500 rounded-lg py-3 px-4 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center">
              <FaLock className="mx-auto text-orange-500 mb-3" size={32} />
              <h2 className="text-2xl font-bold text-gray-800">Verify Code</h2>
              <p className="text-gray-500 mt-1">
                Enter the 6-digit code sent to <strong>{formData.email}</strong>.
              </p>
            </div>

            <div>
              <label className="font-medium text-gray-600" htmlFor="otp">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                className="mt-1 w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-center text-lg tracking-widest"
                type="text"
                placeholder="000000"
                maxLength={6}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-Saira text-lg font-semibold text-white bg-orange-500 rounded-lg py-3 px-4 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="text-center">
              <FaLock className="mx-auto text-orange-500 mb-3" size={32} />
              <h2 className="text-2xl font-bold text-gray-800">
                Reset Password
              </h2>
              <p className="text-gray-500 mt-1">
                Create a new, strong password.
              </p>
            </div>

            <div>
              <label
                className="font-medium text-gray-600"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-orange-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
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
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-orange-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-Saira text-lg font-semibold text-white bg-orange-500 rounded-lg py-3 px-4 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        );
      default:
        return null;
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
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm">
              {success}
            </div>
          )}

          {renderStepContent()}

          <div className="mt-6 text-center text-gray-500">
            {step < 3 && (
              <p>
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-orange-500 font-semibold hover:text-orange-600"
                >
                  Log In
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;