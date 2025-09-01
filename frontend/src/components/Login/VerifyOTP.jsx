import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { landingHero } from "../../assets/index.js";
import { FaSpinner } from "react-icons/fa";

function VerifyOTP() {
  const { verifyOtp, resendOtp, isAuthenticated, isLoading: authLoading } = useAuth();
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [resending, setResending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(120);
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  React.useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyOtp(email, otp);
      
      if (result.success) {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setResending(true);

    try {
      const result = await resendOtp(email);
      if (result.success) {
        setSuccess("OTP resent successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setCooldown(120);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  // Countdown effect for cooldown
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

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
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper to format cooldown as mm:ss
  const formatCooldown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              Verify Your Email
            </h2>
            <p className="text-gray-500 mt-1">
              We've sent a 6-digit code to <strong>{email}</strong>.
            </p>
          </div>

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

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="font-medium text-gray-600" htmlFor="otp">
                Verification Code
              </label>
              <input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 w-full bg-white caret-orange-500 px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-center text-2xl tracking-widest"
                type="text"
                placeholder="000000"
                maxLength="6"
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
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500">
            <p>
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOTP}
                disabled={resending || cooldown > 0}
                className="text-orange-500 font-semibold hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resending
                  ? 'Resending...'
                  : cooldown > 0
                  ? `Resend in ${formatCooldown(cooldown)}`
                  : 'Resend Code'}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center text-gray-500">
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;