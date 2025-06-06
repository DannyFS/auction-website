// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroVideo from '../assets/homepage-hero.mp4';
import beachPoster from '../assets/beach.jpg';

export default function Home() {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        fetch('https://auction-website-server-production.up.railway.app/api/admin/website/visitor-count', {
            method: 'POST'
        }).catch(console.error);

        fetch('https://auction-website-server-production.up.railway.app/api/admin/auctions')
            .then(res => res.json())
            .then(data => setAuctions(data))
            .catch(err => console.error('Failed to load auctions:', err));
    }, []);

    const upcoming = auctions.filter(a => a.biddingStatus === 'Starting Soon');
    const current = auctions.filter(a => a.biddingStatus === 'Accepting Bids');

    return (
        <>
            <Header />
            <Navbar />

            {/* HERO SECTION */}
            <div className="relative w-full h-screen max-h-[100dvh] overflow-hidden">
                <video
                    className="absolute w-full h-full object-cover z-0"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={beachPoster}
                    onError={(e) => console.error('Video failed to load:', e)}
                >
                    <source src={heroVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
                <div className="relative z-20 h-full flex flex-col justify-center items-start text-white px-10 md:px-20 space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight animate-fadeInUp">
                        Carolina Investor Auction
                    </h1>
                    <p className="text-lg md:text-2xl max-w-xl animate-fadeInUp delay-200">
                        Discover exclusive property deals and investment opportunities.
                    </p>
                    <a
                        href="#auctions-start"
                        className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded shadow animate-fadeInUp delay-300"
                    >
                        Explore Auctions
                    </a>
                </div>
            </div>

            {/* CURRENT AUCTIONS */}
            <div id="auctions-start" className="bg-white py-20 px-6 md:px-16 space-y-12">
                <section>
                    <h2 className="text-[#004aad] text-3xl md:text-4xl font-semibold mb-6 border-b pb-2">Live Auctions</h2>
                    {current.length ? (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {current.map(a => (
                                <div
                                    key={a._id}
                                    className="bg-white rounded-xl shadow-lg border hover:shadow-2xl transition transform hover:scale-105 p-6 space-y-3"
                                >
                                    <h3
                                        className="text-2xl font-bold text-blue-700 hover:underline cursor-pointer"
                                        onClick={() => window.location.href = `/auction/${a._id}`}
                                    >
                                        {a.name}
                                    </h3>
                                    <p className="text-gray-700">{a.tagLine}</p>
                                    <p className="text-sm text-gray-500"><strong>Ends:</strong> {new Date(a.endTime).toLocaleString()}</p>
                                    <p className="text-xl text-green-600 font-semibold">
                                        Current Bid: ${a.currentPrice || 0}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No live auctions right now.</p>
                    )}
                </section>
            </div>

            <Footer />
        </>
    );
}
