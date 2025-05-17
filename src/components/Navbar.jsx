import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-masthead-white__large.png';

export default function Navbar() {
  return (
      <div className="sticky top-0 z-50 bg-[#566573] shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/">
        <img
          src={logo}
          alt="Logo"
          className="h-24 object-contain"
          style={{ aspectRatio: '53 / 18' }}
        />
      </Link>
      <nav className="flex gap-6">
        <Link to="/current-auctions" className="text-black hover:text-white font-bold">Current Auctions</Link>
        <Link to="/results" className="text-black hover:text-white font-bold">Results</Link>
        <Link to="/about-us" className="text-black hover:text-white font-bold">About Us</Link>
        <Link to="/charity" className="text-black hover:text-white font-bold">Charity</Link>
      </nav>
    </div>
  );
}
