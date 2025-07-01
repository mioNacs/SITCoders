import React from 'react'
import landingHero from '../../assets/index'
import HeroText from './HeroText'
import {Link, NavLink} from 'react-router-dom'

function HeroSection() {
  return (
    <div className='flex flex-col select-none md:flex-row bg-white text-black min-h-screen'>
      <div className='sticky px-4 sm:px-6 md:px-8 lg:mx-20 flex flex-col md:flex-row items-center justify-center w-full'>
        <div className='w-full md:w-1/2 lg:w-1/2 object-cover mt-8 md:mt-0'>
          <img 
            className='transition-all duration-1000 ease-in-out hover:hue-rotate-60 select-none max-w-full h-auto'
            draggable="false"
            src={landingHero} 
            alt="heroImg" 
          />
        </div>
        <div className='w-full md:w-1/2 block justify-start mt-6 md:mt-0 px-4'>
          <HeroText />
          <div className='flex flex-col justify-center sm:flex-row space-y-4 
          sm:space-y-0 sm:space-x-4 md:space-x-6 mt-6'>
            <Link to={"/login"}>
            <div className='bg-orange-400 p-2 md:p-3 hover:drop-shadow-2xl duration-400 text-white font-medium 
            px-4 md:px-6 rounded-full text-lg md:text-xl hover:bg-gray-600 cursor-pointer'>
              Log In
            </div>
            </Link>
            <Link to={"/signup"}>
            <div className='bg-orange-400 p-2 md:p-3 hover:drop-shadow-2xl duration-400 text-white font-medium 
            px-4 md:px-6 rounded-full text-lg md:text-xl hover:bg-gray-600 cursor-pointer'>
              Sign Up
            </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
