import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-masthead-white__large.png';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-[#566573] shadow-md">
      <div className="py-4 px-6 flex justify-between items-center">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-24 object-contain"
            style={{ aspectRatio: '53 / 18' }}
          />
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="text-white text-3xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          <Link to="/current-auctions" className="text-black hover:text-white font-bold">Current Auctions</Link>
          <Link to="/results" className="text-black hover:text-white font-bold">Results</Link>
          <Link to="/about-us" className="text-black hover:text-white font-bold">About Us</Link>
          <Link to="/charity" className="text-black hover:text-white font-bold">Charity</Link>
        </nav>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-[#566573] px-6 pb-4 flex flex-col gap-4">
          <Link to="/current-auctions" className="text-black hover:text-white font-bold" onClick={() => setMenuOpen(false)}>Current Auctions</Link>
          <Link to="/results" className="text-black hover:text-white font-bold" onClick={() => setMenuOpen(false)}>Results</Link>
          <Link to="/about-us" className="text-black hover:text-white font-bold" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/charity" className="text-black hover:text-white font-bold" onClick={() => setMenuOpen(false)}>Charity</Link>
        </div>
      )}
    </div>
  );
}


