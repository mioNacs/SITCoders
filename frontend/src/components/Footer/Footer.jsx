import { Link } from "react-router-dom";
import { FaGithub, FaDiscord, FaRegHeart } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="relative border-t font-Jost border-gray-200 py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and College Info */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to={"/"} className="mb-4">
              <span className="text-3xl text-gray-500 font-Saira font-bold">
                SIT
              </span>
              <span className="text-3xl text-orange-400 font-Saira font-bold">
                Coders
              </span>
            </Link>
            <p className="text-gray-600">
              From{" "}
              <a
                className="text-orange-400 hover:underline transition-colors duration-150"
                href="https://www.sityog.edu.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sityog Institute of Technology
              </a>
            </p>
            <p className="text-gray-500 text-sm">Aurangabad, Bihar</p>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                    <FaGithub /> Github
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                    <FaDiscord /> Discord
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-800 uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
            {/* You can add another column of links here if needed */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SITCoders. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Made with{" "}
            <FaRegHeart className="inline text-red-500" />
            {" "}by Team SITCoders
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;