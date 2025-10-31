import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-left mb-8 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold font-sans text-gray-100 break-words uppercase">
        what is <span className="text-lime-400">selling now?</span>
      </h1>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl font-mono">
        Discover emerging product trends, powered by real-time market data.
      </p>
    </header>
  );
};

export default Header;