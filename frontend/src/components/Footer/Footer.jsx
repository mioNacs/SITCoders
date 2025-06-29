import React from "react";

function Footer() {
  return (
    <div>
      <footer className="border-t font-Jost border-black/20 py-4 px-10">
      <div className="absolute instet-0 bg-cover bg-center"></div>

        <div className="flex flex-col md:flex-row justify-between items-center border-y border-black/20 p-4 md:p-8 mx-4 md:mx-10 my-4">
            <div className="mb-4 md:mb-0">
                <span className="text-3xl md:text-4xl text-gray-600 font-Saira font-bold">SIT</span>
                <span className="text-3xl md:text-4xl text-orange-400 font-Saira font-bold">Coders</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between w-full md:w-1/2 lg:w-1/3 py-4 gap-8 sm:gap-4">
              <ul className="text-left space-y-2 md:space-y-4">
                <li className="font-medium"> FOLLOW US </li>
                <li className="text-sm"> Github </li>
                <li className="text-sm"> Discord </li>
              </ul>
              <ul className="text-left space-y-2 md:space-y-4 mt-4 sm:mt-0">
                <li className="font-medium"> LEGAL </li>
                <li className="text-sm"> Privacy Policy </li>
                <li className="text-sm"> Terms & Conditions </li>
              </ul>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-12 container text-center sm:text-left gap-2 sm:gap-0">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} SITCoders. All rights reserved.
          </p>
          <p className="text-sm">
            Made with{" "}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="red"
              strokeWidth="2"
              className="inline-block"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>{" "}
            by Team SITCoders
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
