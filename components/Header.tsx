import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-left mb-8 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold font-serif text-black break-words">
        what is selling now?
      </h1>
      <p className="mt-4 text-lg text-black max-w-2xl font-mono">
        Data-driven trend analysis. No frills.
      </p>
    </header>
  );
};

export default Header;