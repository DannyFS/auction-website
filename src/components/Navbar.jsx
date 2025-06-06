import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow z-50 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-[#004aad] text-2xl font-bold">
                            Carolina Auction
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className="text-gray-800 hover:text-[#004aad] font-medium">
                            Home
                        </Link>
                        <Link to="/auctions" className="text-gray-800 hover:text-[#004aad] font-medium">
                            Auctions
                        </Link>
                        <Link to="/about" className="text-gray-800 hover:text-[#004aad] font-medium">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-800 hover:text-[#004aad] font-medium">
                            Contact
                        </Link>
                    </div>

                    {/* Mobile menu toggle button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-700 hover:text-[#004aad] focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown menu */}
                {menuOpen && (
                    <div className="md:hidden flex flex-col space-y-2 mt-2 pb-4 border-t pt-4">
                        <Link
                            to="/"
                            onClick={() => setMenuOpen(false)}
                            className="text-gray-800 hover:text-[#004aad] font-medium px-2"
                        >
                            Home
                        </Link>
                        <Link
                            to="/auctions"
                            onClick={() => setMenuOpen(false)}
                            className="text-gray-800 hover:text-[#004aad] font-medium px-2"
                        >
                            Auctions
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setMenuOpen(false)}
                            className="text-gray-800 hover:text-[#004aad] font-medium px-2"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            onClick={() => setMenuOpen(false)}
                            className="text-gray-800 hover:text-[#004aad] font-medium px-2"
                        >
                            Contact
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

