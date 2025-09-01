import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

function HeroText() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="text-center lg:text-left">
      <h1 className="font-Saira font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight">
        <span className="text-gray-800">SIT</span>
        <span className="text-orange-500">Coders</span>
      </h1>
      <p className="mt-4 text-xl sm:text-2xl text-gray-600 max-w-xl mx-auto lg:mx-0">
        Empowering <span className="font-semibold text-orange-500">Innovation</span>, One Line of <span className="font-semibold text-orange-500">Code</span> at a Time.
      </p>

      <div
        className="mt-6 inline-block cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center text-gray-600 hover:text-orange-500 transition-colors">
          <span className="font-semibold">
            {isExpanded ? 'Read Less' : 'Read More'}
          </span>
          <FaChevronDown
            className={`ml-2 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 text-left text-gray-700 space-y-4 max-w-2xl mx-auto lg:mx-0 pr-4">
              <p>
                Dear Students,
              </p>
              <p>
                With warm regards, we at SITCoders are thrilled to welcome you to our community. Here, we are determined to provide you with the best possible collaborative platform where you can share your <span className="font-semibold text-orange-500">queries</span>, <span className="font-semibold text-orange-500">projects</span>, and <span className="font-semibold text-orange-500">ideas</span> with other students and faculty members.
              </p>
              <p>
                We are committed to fostering a culture of innovation and collaboration, and we believe that SITCoders will play a vital role in achieving this goal. We look forward to working with you and supporting you in your academic journey.
              </p>
              <p>
                Best regards,
                <br />
                <span className="font-semibold">Team SITCoders</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HeroText;