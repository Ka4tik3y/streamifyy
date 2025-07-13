import React from "react";
import { Link } from "react-router-dom";
import { ShipWheelIcon } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 shadow-md">
        <div className="flex items-center space-x-2">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono text-black tracking-wider">
            Streamify
          </span>
        </div>
        <Link to="/login" className="text-sm font-medium hover:underline">
          Login
        </Link>
      </nav>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-extrabold mb-4">
          Connect. Communicate. Collaborate.
        </h1>
        <p className="text-lg max-w-xl mb-6">
          Streamify is your all-in-one platform to chat and video call
          seamlessly with friends, or global communities. Fast and secure.
        </p>
        <Link to="/signup">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-xl shadow transition duration-200">
            Start Chatting
          </button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Streamify. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
