import React from "react";
import { navneet, avesh } from "../../assets";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

function MeetTheDevs() {
  const developers = [
    {
      name: "Navneet Raj",
      role: "Full Stack Developer",
      image: navneet,
      github: "https://github.com/mionacs",
      linkedin: "https://www.linkedin.com/in/mionacs",
      instagram: "https://www.instagram.com/be_mionacs",
    },
    {
      name: "Avesh Raj Singh",
      role: "Full Stack Developer",
      image: avesh,
      github: "https://github.com/AveshRajSingh",
      linkedin: "https://www.linkedin.com/in/avesh-web-dev/",
      instagram: "https://www.instagram.com/rajput_hu_bha1/",
    },
  ];

  return (
    <div className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-Saira font-extrabold text-gray-900">
            Meet the Developers
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            The minds behind the code. Connect with us on social media.
          </p>
        </div>

        <div className="flex justify-center gap-8 lg:gap-12">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="group w-full max-w-sm bg-gray-50 rounded-xl shadow-lg p-8 text-center transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={dev.image}
                alt={dev.name}
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-110"
              />
              <h3 className="text-2xl font-Saira font-bold text-gray-900 mb-1">
                {dev.name}
              </h3>
              <p className="text-orange-500 font-semibold mb-6">{dev.role}</p>
              
              <div className="flex justify-center space-x-5">
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label={`${dev.name}'s Github`}
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-700 transition-colors"
                  aria-label={`${dev.name}'s LinkedIn`}
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href={dev.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-pink-600 transition-colors"
                  aria-label={`${dev.name}'s Instagram`}
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MeetTheDevs;