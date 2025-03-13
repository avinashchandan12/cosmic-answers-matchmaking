
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Star, User, MessageCircle, Heart } from 'lucide-react';

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
    <nav className="bg-purple-dark py-4 px-6 md:px-8 flex justify-between items-center relative z-50 shadow-lg">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-white/10 rounded-full p-1.5">
          <Star className="h-5 w-5 text-orange" />
        </div>
        <span className="text-xl font-bold text-white">AstroMatch</span>
      </Link>
      
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
        <Link to="/" className={getNavLinkClass('/') + " flex items-center gap-1.5 pb-1"}>
          <Star size={18} className="text-white/70" />
          <span>Home</span>
        </Link>
        <Link to="/match" className={getNavLinkClass('/match') + " flex items-center gap-1.5 pb-1"}>
          <Heart size={18} className="text-white/70" />
          <span>Match</span>
        </Link>
        <Link to="/chat" className={getNavLinkClass('/chat') + " flex items-center gap-1.5 pb-1"}>
          <MessageCircle size={18} className="text-white/70" />
          <span>Chat</span>
        </Link>
        <Link to="/profile" className={getNavLinkClass('/profile') + " flex items-center gap-1.5 pb-1"}>
          <User size={18} className="text-white/70" />
          <span>Profile</span>
        </Link>
      </div>

      {/* Mobile navigation overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-purple-dark shadow-lg">
          <div className="flex flex-col p-4 space-y-4 text-white">
            <Link to="/" className={getNavLinkClass('/') + " flex items-center gap-2 py-2"} onClick={toggleMenu}>
              <Star size={18} className="text-white/70" />
              <span>Home</span>
            </Link>
            <Link to="/match" className={getNavLinkClass('/match') + " flex items-center gap-2 py-2"} onClick={toggleMenu}>
              <Heart size={18} className="text-white/70" />
              <span>Match</span>
            </Link>
            <Link to="/chat" className={getNavLinkClass('/chat') + " flex items-center gap-2 py-2"} onClick={toggleMenu}>
              <MessageCircle size={18} className="text-white/70" />
              <span>Chat</span>
            </Link>
            <Link to="/profile" className={getNavLinkClass('/profile') + " flex items-center gap-2 py-2"} onClick={toggleMenu}>
              <User size={18} className="text-white/70" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
