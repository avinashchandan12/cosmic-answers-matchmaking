
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const getNavLinkClass = (path: string) => {
    return location.pathname === path 
      ? "text-orange border-b-2 border-orange pb-1" 
      : "hover:text-orange transition-colors";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-purple-dark py-4 px-4 flex justify-between items-center relative z-50">
      <Link to="/" className="text-2xl font-bold text-white">AstroMatch</Link>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-white focus:outline-none" 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop navigation */}
      <div className="hidden md:flex gap-6 text-white">
        <Link to="/" className={getNavLinkClass('/')}>Home</Link>
        <Link to="/match" className={getNavLinkClass('/match')}>Match</Link>
        <Link to="/results" className={getNavLinkClass('/results')}>Results</Link>
        <Link to="/chat" className={getNavLinkClass('/chat')}>Chat</Link>
        <Link to="/profile" className={getNavLinkClass('/profile')}>Profile</Link>
      </div>

      {/* Mobile navigation overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-purple-dark shadow-lg animate-fade-up">
          <div className="flex flex-col p-4 space-y-4 text-white">
            <Link to="/" className={getNavLinkClass('/') + " py-2"} onClick={toggleMenu}>Home</Link>
            <Link to="/match" className={getNavLinkClass('/match') + " py-2"} onClick={toggleMenu}>Match</Link>
            <Link to="/results" className={getNavLinkClass('/results') + " py-2"} onClick={toggleMenu}>Results</Link>
            <Link to="/chat" className={getNavLinkClass('/chat') + " py-2"} onClick={toggleMenu}>Chat</Link>
            <Link to="/profile" className={getNavLinkClass('/profile') + " py-2"} onClick={toggleMenu}>Profile</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
