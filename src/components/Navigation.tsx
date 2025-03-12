
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="container mx-auto py-6 px-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">AstroMatch</Link>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-orange transition-colors">Home</Link>
        <Link to="/match" className="hover:text-orange transition-colors">Match</Link>
        <Link to="/results" className="hover:text-orange transition-colors">Results</Link>
        <Link to="/chat" className="hover:text-orange transition-colors">Chat</Link>
      </div>
    </nav>
  );
};

export default Navigation;
