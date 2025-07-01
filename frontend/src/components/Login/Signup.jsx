import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [phase, setPhase] = React.useState(1);

  const handleNextPhase = (e) => {
    e.preventDefault();
    setPhase(2);
  };

  const handlePrevPhase = (e) => {
    e.preventDefault();
    setPhase(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your signup logic here
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
        <div className="text-center">
          Make an account to join the community!
        </div>
        <div className="mt-4 text-sm sm:text-lg">
          <form className="flex flex-col gap-3" action="">
            {phase === 1 ? (
              <>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-col w-full">
                    <label className="font-medium" htmlFor="FirstName">
                      First Name:
                    </label>
                    <input
                      id="FirstName"
                      className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                      type="text"
                      placeholder="eg: John/Jane"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="font-medium" htmlFor="LastName">
                      Last Name:
                    </label>
                    <input
                      id="LastName"
                      className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                      type="text"
                      placeholder="eg: Doe"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <label className="font-medium" htmlFor="Email">
                    Email:
                  </label>
                  <input
                    id="Email"
                    className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                    type="text"
                    placeholder="eg: johndoe@example.com"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-col w-full">
                    <label className="font-medium" htmlFor="RollNo">
                      Roll No:
                    </label>
                    <input
                      id="RollNo"
                      className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                      type="text"
                      placeholder="eg: 22CSE08"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="font-medium" htmlFor="Gender">
                      Gender:
                    </label>
                    <select
                      id="Gender"
                      className="bg-gray-50 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                      required
                    >
                      <option value="" disabled selected>
                        Select gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleNextPhase}>
                  <div className="bg-orange-400 shadow-md hover:shadow-lg font-Saira text-lg sm:text-xl text-white px-4 py-2 rounded-md mt-2 hover:bg-orange-500 transition-all duration-200 ease-in-out cursor-pointer">
                    Next
                  </div>
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col justify-between">
                  <label className="font-medium" htmlFor="Username">
                    Username:
                  </label>
                  <input
                    id="Username"
                    className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                    type="text"
                    placeholder="Enter a username"
                    required
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <label className="font-medium" htmlFor="Password">
                    Password:
                  </label>
                  <input
                    className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                    id="Password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <label className="font-medium" htmlFor="ConfirmPassword">
                    Confirm Password:
                  </label>
                  <input
                    className="bg-gray-50 caret-orange-400 px-4 py-2 rounded-md outline-none border border-gray-300 focus:border-orange-400 focus:shadow-lg shadow-orange-400/10"
                    id="ConfirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={handlePrevPhase}>
                    <div className="bg-gray-400 shadow-md hover:shadow-lg font-Saira text-lg sm:text-xl text-white px-4 py-2 rounded-md mt-2 hover:bg-gray-500 transition-all duration-200 ease-in-out cursor-pointer">
                      Back
                    </div>
                  </button>
                  <button onClick={handleSubmit}>
                    <div className="bg-orange-400 shadow-md hover:shadow-lg font-Saira text-lg sm:text-xl text-white px-4 py-2 rounded-md mt-2 hover:bg-orange-500 transition-all duration-200 ease-in-out cursor-pointer">
                      Sign Up
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
