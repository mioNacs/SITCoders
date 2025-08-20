import React from "react";
import { Link, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="min-h-screen px-2 flex flex-col items-center justify-center bg-orange-50 font-Jost">
      <div className="bg-white p-4 py-6 sm:p-8 mx-2 rounded-2xl shadow-2xl border-2 border-orange-300 max-w-md w-full text-center animate-fade-in">
        <div className="flex flex-col items-center mb-4">
          <span className="text-6xl mb-2 animate-bounce">😕</span>
          <h1 className="text-4xl font-extrabold text-orange-500 mb-2 drop-shadow">Oops!</h1>
        </div>
        <p className="text-lg text-gray-700 mb-4">Something went wrong.<br />Please try again or go back to the homepage.</p>
        <a href="/" className="inline-block mt-2 px-6 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-colors duration-200">Go back to Home</a>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.5s ease; }
      `}</style>
    </div>
  );
}

export default ErrorPage;
