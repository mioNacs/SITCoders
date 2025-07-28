import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function Login() {
  const { login, isAuthenticated} = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [formData, setFormData] = React.useState({
    emailOrUsername: "",
    password: ""
  });
  
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const isEmail = formData.emailOrUsername.includes('@');
      const loginData = {
        password: formData.password,
        ...(isEmail ? { email: formData.emailOrUsername } : { username: formData.emailOrUsername })
      };

      const result = await login(loginData);
      
      if (result.success) {
        // Navigate to home page
        navigate('/');
      } else {
        setError(result.message);
      }
      
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-4 text-sm sm:text-lg">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-col justify-between ">
              <label className="font-medium" htmlFor="emailOrUsername">
                Email/Username:
              </label>
              <input
                id="emailOrUsername"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleInputChange}
                className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                type="text"
                placeholder="Enter your email or username"
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col justify-between ">
              <label className="font-medium" htmlFor="password">
                Password:
              </label>
              <div className="flex px-4 py-2 gap-x-1 rounded-md bg-gray-50 border border-gray-300 has-focus:border-orange-400 has-focus:shadow-lg shadow-orange-400/10">
                <input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="outline-none w-full caret-orange-400"
                  type={isVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <div
                  className="flex items-center"
                  onClick={() => setIsVisible((prev) => !prev)}
                >
                  <svg
                    className="fill-current hover:fill-orange-400 transition-all duration-200 ease-in-out cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#1f1f1f"
                  >
                    {isVisible ? (
                      <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                    ) : (
                      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                    )}
                  </svg>
                </div>
              </div>
              <div className="text-sm text-orange-400 text-end py-3 cursor-pointer hover:text-orange-500 transition-all duration-200">
                Forgot Password?
              </div>
            </div>
            <button type="submit" disabled={loading}>
              <div className={`${loading ? 'bg-gray-400' : 'bg-orange-400 hover:bg-orange-500'} shadow-md hover:shadow-lg font-Saira text-lg sm:text-xl text-white px-4 py-2 rounded-md mt-2 transition-all duration-200 ease-in-out cursor-pointer`}>
                {loading ? 'Logging in...' : 'Log In'}
              </div>
            </button>
          </form>
          <div className="mt-6 text-center text-sm sm:text-lg">
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="text-orange-400 hover:text-orange-500 cursor-pointer">
                Sign Up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
