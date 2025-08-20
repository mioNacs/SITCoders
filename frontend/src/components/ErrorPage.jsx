import React from "react";
import { Link, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 font-Jost">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-orange-200 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">Oops!</h1>
        <p className="text-lg text-gray-700 mb-2">Something went wrong.</p>
        {error && (
          <pre className="bg-orange-100 text-orange-700 p-2 rounded mb-4 text-sm overflow-x-auto">
            {error.statusText || error.message}
          </pre>
        )}
        <Link to="/" className="text-orange-500 hover:text-orange-600 font-medium">
          Go back to Home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
