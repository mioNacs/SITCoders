import React from 'react';
import { Link } from 'react-router-dom';
import { landingHero } from '../../assets';
import HeroText from './HeroText';

function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden pt-20 lg:pt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side: Text content */}
          <div className="text-center lg:text-left">
            <HeroText />
            <div className="mt-8 flex justify-center lg:justify-start space-x-4">
              <Link
                to="/login"
                className="px-8 py-3 text-lg font-semibold text-gray-800 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-100 hover:border-gray-400 transition-all transform hover:scale-105"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3 text-lg font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Right side: Image */}
          <div className="flex justify-center items-center">
            <img
              className="w-full max-w-lg h-auto object-contain transition-transform duration-500 ease-in-out hover:scale-105"
              draggable="false"
              src={landingHero}
              alt="Community Platform Illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
