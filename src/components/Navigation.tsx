
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const getNavLinkClass = (path: string) => {
    return location.pathname === path 
      ? "text-white nav-active" 
      : "text-white/70 hover:text-white transition-colors";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-purple-dark py-4 px-6 flex justify-between items-center relative z-50">
      <Link to="/" className="text-xl font-bold text-white">AstroMatch</Link>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-white focus:outline-none" 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop navigation */}
      <div className="hidden md:flex gap-8 text-white">
        <Link to="/" className={getNavLinkClass('/') + " pb-1"}>Home</Link>
        <Link to="/match" className={getNavLinkClass('/match') + " pb-1"}>Match</Link>
        <Link to="/chat" className={getNavLinkClass('/chat') + " pb-1"}>Chat</Link>
        <Link to="/profile" className={getNavLinkClass('/profile') + " pb-1"}>Profile</Link>
      </div>

      {/* Mobile navigation overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-purple-dark shadow-lg">
          <div className="flex flex-col p-4 space-y-4 text-white">
            <Link to="/" className={getNavLinkClass('/') + " py-2"} onClick={toggleMenu}>Home</Link>
            <Link to="/match" className={getNavLinkClass('/match') + " py-2"} onClick={toggleMenu}>Match</Link>
            <Link to="/chat" className={getNavLinkClass('/chat') + " py-2"} onClick={toggleMenu}>Chat</Link>
            <Link to="/profile" className={getNavLinkClass('/profile') + " py-2"} onClick={toggleMenu}>Profile</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
