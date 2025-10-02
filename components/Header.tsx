
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gemini-light p-4 border-b border-gemini-grey shadow-md">
      <div className="max-w-5xl mx-auto flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.C14.05 5.02 16 7.24 16 10c0 .333 0 .667-.02 1-.393 4.28-4.5 4.5-4.5 4.5s.22 4.107 4.5 4.5c.013.333.02.667.02 1 .001 2.76-1.95 4.98-4.014 6.986C12.5 21.5 12 19 12 17c2-1 2.657-1.343 2.657-1.343a8 8 0 013 3z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-wider">Gemini Chat</h1>
      </div>
    </header>
  );
};

export default Header;
