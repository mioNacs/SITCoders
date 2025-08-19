import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaSpinner, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function ForgotPassword() {
  const { sendResetPasswordOtp, verifyResetPasswordOtp, resetPassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
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
    confirmPassword: ""
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    // Basic email validation
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
      const result = await resetPassword(formData.newPassword, formData.confirmPassword);
      
      if (result.success) {
        setSuccess("Password reset successfully! You can now login with your new password.");
        setTimeout(() => {
          navigate('/login');
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

  const renderStep1 = () => (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div className="text-center mb-6">
        <FaLock className="mx-auto text-orange-500 mb-2" size={32} />
        <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
        <p className="text-gray-600 text-sm mt-1">
          Enter your email address and we'll send you an OTP to reset your password
        </p>
      </div>

      <div className="flex flex-col">
        <label className="font-medium text-gray-700" htmlFor="email">
          Email Address:
        </label>
        <input
          className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
          placeholder="Enter your email"
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-md text-sm">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <FaSpinner className="animate-spin" />}
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      <div className="text-center">
        <Link to="/login" className="text-orange-500 hover:text-orange-600 text-sm">
          Back to Login
        </Link>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-4">
      <div className="text-center mb-6">
        <FaLock className="mx-auto text-orange-500 mb-2" size={32} />
        <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
        <p className="text-gray-600 text-sm mt-1">
          Enter the 6-digit OTP sent to {formData.email}
        </p>
      </div>

      <div className="flex flex-col">
        <label className="font-medium text-gray-700" htmlFor="otp">
          OTP Code:
        </label>
        <input
          className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10 text-center text-lg tracking-wider"
          id="otp"
          name="otp"
          value={formData.otp}
          onChange={handleInputChange}
          type="text"
          placeholder="0 0 0 0 0 0"
          maxLength={6}
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-md text-sm">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <FaSpinner className="animate-spin" />}
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-orange-500 hover:text-orange-600 text-sm"
        >
          Back to Email
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="text-center mb-6">
        <FaLock className="mx-auto text-orange-500 mb-2" size={32} />
        <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
        <p className="text-gray-600 text-sm mt-1">
          Enter your new password
        </p>
      </div>

      <div className="flex flex-col">
        <label className="font-medium text-gray-700" htmlFor="newPassword">
          New Password:
        </label>
        <div className="relative">
          <input
            className="w-full bg-gray-50 caret-orange-400 px-4 py-2 pr-10 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <label className="font-medium text-gray-700" htmlFor="confirmPassword">
          Confirm Password:
        </label>
        <div className="relative">
          <input
            className="w-full bg-gray-50 caret-orange-400 px-4 py-2 pr-10 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-md text-sm">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <FaSpinner className="animate-spin" />}
        {loading ? "Resetting Password..." : "Reset Password"}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md border border-orange-100 p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
