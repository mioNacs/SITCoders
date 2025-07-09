import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

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
  
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNextPhase = (e) => {
    e.preventDefault();
    setError("");
    
    // Validate phase 1 fields
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.rollNo || !formData.gender) {
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
      submitData.append('username', formData.username);
      submitData.append('fullName', `${formData.firstName} ${formData.lastName}`);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('rollNo', formData.rollNo);
      submitData.append('gender', formData.gender);

      const result = await register(submitData);
      
      if (result.success) {
        // Navigate to OTP verification page with email
        navigate('/verify-otp', { state: { email: formData.email } });
      } else {
        setError(result.message);
      }
      
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="font-Jost flex h-screen justify-center items-center text-gray-600 bg-orange-100/30">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

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
        <div className="text-center">
          Make an account to join the community!
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-4 text-sm sm:text-lg">
          <form className="flex flex-col gap-3" onSubmit={phase === 1 ? handleNextPhase : handleSubmit}>
            {phase === 1 ? (
              <>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-col w-full">
                    <label className="font-medium" htmlFor="firstName">
                      First Name:
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                      type="text"
                      placeholder="eg: John/Jane"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="font-medium" htmlFor="lastName">
                      Last Name:
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                      type="text"
                      placeholder="eg: Doe"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <label className="font-medium" htmlFor="email">
                    Email:
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                    type="email"
                    placeholder="eg: johndoe@example.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-col w-full">
                    <label className="font-medium" htmlFor="rollNo">
                      Roll No:
                    </label>
                    <input
                      id="rollNo"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                      type="text"
                      placeholder="eg: 22CSE08"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="font-medium" htmlFor="gender">
                      Gender:
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="bg-gray-50 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
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
                <button type="submit" disabled={loading}>
                  <div className="bg-orange-400 shadow-md hover:shadow-lg font-Saira text-lg sm:text-xl text-white px-4 py-2 rounded-md mt-2 hover:bg-orange-500 transition-all duration-200 ease-in-out cursor-pointer">
                    Next
                  </div>
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col justify-between">
                  <label className="font-medium" htmlFor="username">
                    Username:
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                    type="text"
                    placeholder="Enter a username"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <label className="font-medium" htmlFor="password">
                    Password:
                  </label>
                  <input
                    className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type="password"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <label className="font-medium" htmlFor="confirmPassword">
                    Confirm Password:
                  </label>
                  <input
                    className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Re-enter your password"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={handlePrevPhase} disabled={loading}>
                    <div className="bg-gray-400 shadow-md hover:shadow-lg font-Saira text-lg sm:text-xl text-white px-4 py-2 rounded-md mt-2 hover:bg-gray-500 transition-all duration-200 ease-in-out cursor-pointer">
                      Back
                    </div>
                  </button>
                  <button type="submit" disabled={loading}>
                    <div className={`${loading ? 'bg-gray-400' : 'bg-orange-400 hover:bg-orange-500'} shadow-md hover:shadow-lg font-Saira text-lg sm:text-xl text-white px-4 py-2 rounded-md mt-2 transition-all duration-200 ease-in-out cursor-pointer`}>
                      {loading ? 'Creating Account...' : 'Sign Up'}
                    </div>
                  </button>
                </div>
              </>
            )}
          </form>
          <div className="mt-6 text-center text-sm sm:text-lg">
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-orange-400 hover:text-orange-500 cursor-pointer">
                Log In
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
