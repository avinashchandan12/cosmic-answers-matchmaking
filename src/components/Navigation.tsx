
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const getNavLinkClass = (path: string) => {
    return location.pathname === path 
      ? "text-orange border-b-2 border-orange pb-1" 
      : "hover:text-orange transition-colors";
  };

  return (
    <nav className="bg-purple-dark py-4 px-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white">AstroMatch</Link>
      <div className="flex gap-6 text-white">
        <Link to="/" className={getNavLinkClass('/')}>Home</Link>
        <Link to="/match" className={getNavLinkClass('/match')}>Match</Link>
        <Link to="/results" className={getNavLinkClass('/results')}>Results</Link>
        <Link to="/chat" className={getNavLinkClass('/chat')}>Chat</Link>
        <Link to="/profile" className={getNavLinkClass('/profile')}>Profile</Link>
      </div>
    </nav>
  );
};

export default Navigation;
