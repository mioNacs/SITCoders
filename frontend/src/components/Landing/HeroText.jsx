import React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=keyboard_double_arrow_down" />

function HeroText() {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
      <div 
        className='text-center no-scrollbar cursor-pointer'
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsExpanded(true)}
      >
        <h1 
          className='font-Saira font-bold text-shadow-lg 
          select-none text-center text-4xl sm:text-5xl md:text-6xl lg:text-8xl'
        >
          <span className='text-gray-600'>SIT</span>
          <span className='text-orange-400'>Coders</span>
        </h1>
        <p 
          className='text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600'
        >
          Empowering
          <span className='text-orange-400'> Innovation</span>,
          <span className='text-orange-400'> Code </span>by 
          <span className='text-orange-400'> Code</span>.
        </p>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className='mx-auto mt-4 md:mt-6 border-b'
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.5 }}
            >
              <p className='font-Jost text-start text-gray-600 text-sm sm:text-base md:text-md lg:text-lg'>
                Dear Students, <br /> 
                With warm regards, we at SITCoders are thrilled to welcome you to our community. <br />
                Here, at SITCoders we are determined to provide you with the best possible colalborative 
                platform Where you can share your <span className='text-orange-400'>Queries</span>, <span className='text-orange-400'>Projects</span>, and 
                <span className='text-orange-400'> Ideas</span> to other students and faculty members. <br />
                We are committed to fostering a culture of innovation and collaboration, 
                and we believe that SITCoders will play a vital role in achieving this goal. <br />
                We look forward to working with you and supporting you in your academic journey. <br />
                <br />
                Best regards, <br />
                Team SITCoders
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <div 
            className={`flex justify-center mt-2 
              ${isExpanded? 'rotate-180' : ''}`}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-orange-400 animate-bounce"
            >
              <path 
                d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" 
                fill="currentColor"
              />
              <path 
                d="M7.41 12.59L12 17.17L16.59 12.59L18 14L12 20L6 14L7.41 12.59Z" 
                fill="currentColor"
              />
            </svg>
          </div>
      </div>
    )
  }


export default HeroText
