// src/components/Footer.jsx
import React from 'react';
import footerLogo from '../assets/logo-footer-white__large.png';

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <>
            <div className="bg-[#333333] text-white px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                <a href="/" className="col-span-1">
                    <img src={footerLogo} alt="Footer Logo" className="h-154" style={{ aspectRatio: '191 / 154' }} />
                </a>

                <div>
                    <h2 className="text-red-600">Quick Links</h2>
                    <ul>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                        <li><a href="/our-app" className="hover:underline">Our App</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-red-600">Contact Us</h2>
                    <p><a href="tel:8039843906" className="hover:underline">Phone: (803) 984-3906</a></p>
                    <p><a href="mailto:adam@ibuycarsandhouses.com" className="hover:underline">Email: adam@ibuycarsandhouses.com</a></p>
                </div>

                <div>
                    <h2 className="text-red-600">Join Our Mailing List</h2>
                    <p className="text-sm">Subscribe to our list and stay up to date with the latest news and deals!</p>
                    <input type="email" placeholder="Subscribe to our newsletter..." className="w-full p-2 mt-2 text-black rounded" />
                    {/* Placeholder for reCAPTCHA */}
                    <div className="my-2"><em>[reCAPTCHA placeholder]</em></div>
                    <button className="bg-blue-600 px-4 py-2 rounded text-white">Subscribe</button>
                </div>
            </div>

            <div className="bg-black text-white text-center py-4 text-sm">
                {year} &copy; Carolina Investor Auction. All Rights Reserved. Software Designed by Daniel Sadrulah
            </div>
        </>
    );
}
