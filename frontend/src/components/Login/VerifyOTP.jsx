import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

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

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="font-Jost flex h-screen justify-center items-center text-gray-600 bg-orange-100/30">
        <div className="text-lg">Loading...</div>
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
    <div className="font-Jost flex h-screen justify-center items-center text-gray-600 bg-orange-100/30">
      <div className="bg-white p-6 px-8 rounded-lg border min-w-[90%] sm:min-w-[70%] md:min-w-[50%] lg:min-w-[35%] border-orange-400 shadow-lg">
        <div className="font-Saira text-3xl text-orange-400 text-center font-medium">
          <span className="text-3xl md:text-4xl text-gray-600 font-Saira font-bold">
            SIT
          </span>
          <span className="text-3xl md:text-4xl text-orange-400 font-Saira font-bold">
            Coders
          </span>
        </div>
        <div className="text-center mt-4">
          <h2 className="text-xl font-medium">Verify Your Email</h2>
          <p className="text-sm text-gray-500 mt-2">
            We've sent a 6-digit OTP to <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="mt-4 text-sm sm:text-lg">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-col justify-between">
              <label className="font-medium" htmlFor="otp">
                Enter OTP:
              </label>
              <input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10 text-center text-2xl tracking-widest"
                type="text"
                placeholder="000000"
                maxLength="6"
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" disabled={loading}>
              <div className={`${loading ? 'bg-gray-400' : 'bg-orange-400 hover:bg-orange-500'} shadow-md hover:shadow-lg font-Saira text-lg sm:text-xl text-white px-4 py-2 rounded-md mt-2 transition-all duration-200 ease-in-out cursor-pointer`}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </div>
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Didn't receive the OTP?{" "}
              <button
                onClick={handleResendOTP}
                disabled={resending || cooldown > 0}
                className="text-orange-400 hover:text-orange-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resending
                  ? 'Resending...'
                  : cooldown > 0
                  ? `Resend OTP (${formatCooldown(cooldown)})`
                  : 'Resend OTP'}
              </button>
            </p>
          </div>

          <div className="mt-6 text-center text-sm sm:text-lg">
            <Link to="/login">
              <span className="text-orange-400 hover:text-orange-500 cursor-pointer">
                Back to Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;