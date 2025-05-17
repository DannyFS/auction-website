import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api } from '../api';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const socket = io('auction-website-server-production.up.railway.app', {
    transports: ['websocket']
});

export default function AuctionDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLightbox, setShowLightbox] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [bidError, setBidError] = useState('');
    const [customBid, setCustomBid] = useState('');

    const API_BASE = 'https://auction-website-server-production.up.railway.app';

    // Helper to fix double or missing slashes
    const getFullImageUrl = (relativePath) => {
        if (!relativePath.startsWith('/')) relativePath = '/' + relativePath;
        return `${API_BASE}${relativePath}`;
    };


    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const res = await api.get(`/api/admin/auctions/${id}`);
                setAuction(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuction();

        socket.on('newBid', ({ auctionId, amount, user, time }) => {
            if (auctionId === id) {
                setAuction(prev => ({
                    ...prev,
                    currentPrice: amount,
                    bidHistory: [
                        ...(prev.bidHistory || []),
                        { userId: user, amount, time: time || new Date() }
                    ]
                }));
            }
        });

        return () => socket.off('newBid');
    }, [id]);



    const getIncrementForPrice = (price) => {
        if (!auction?.increments || auction.increments.length === 0) return 100;
        for (const range of auction.increments) {
            if (price >= range.from && price <= range.to) {
                return range.increment;
            }
        }
        return auction.increments[auction.increments.length - 1].increment;
    };


    const placeBid = async () => {
        if (!user) return alert('Login required to bid.');

        const bidAmount = customBid ? parseFloat(customBid) : nextBid;

        // Validation
        if (bidAmount < nextBid) {
            return setBidError(`Bid must be at least $${nextBid}`);
        }

        try {
            await api.post(`/api/admin/auctions/${id}/bid`, {
                userId: user.id,
                amount: bidAmount
            });

            // Emit with user info for real-time update (include user object)
            socket.emit('placeBid', {
                auctionId: id,
                amount: bidAmount,
                user: {
                    _id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                time: new Date()
            });

            setBidError('');
            setCustomBid('');
        } catch (err) {
            const msg = err.response?.data || err.message;
            setBidError('Failed to place bid: ' + msg);
        }
    };

    if (loading) return <p className="p-6">Loading auction...</p>;
    if (!auction) return <p className="p-6 text-red-600">Auction not found</p>;

    const currentPrice = auction.currentPrice || 0;
    const increment = getIncrementForPrice(currentPrice);
    const nextBid = currentPrice + increment;

    const highestBid = auction.currentPrice || 0;
    const hasPhotos = auction.photos && auction.photos.length > 0;

    return (
        <>
            <Header />
            <Navbar />

            <div className="max-w-5xl mx-auto p-8 space-y-6 bg-white rounded shadow">
                <h1 className="text-3xl font-bold text-[#004aad]">{auction.name}</h1>
                <p className="text-gray-600 italic">{auction.tagLine}</p>

                {hasPhotos && (
                    <div className="flex gap-4 overflow-x-auto">
                        {auction.photos.map((p, i) => (
                            <img
                                key={i}
                                src={getFullImageUrl(p.path)}
                                alt={`Auction ${i}`}
                                className="h-40 rounded cursor-pointer"
                                onClick={() => {
                                    setSelectedIndex(i);
                                    setShowLightbox(true);
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <p><strong>Reserve Price:</strong> ${auction.reserve}</p>
                        <p><strong>Current Highest Bid:</strong> ${highestBid}</p>
                        <p><strong>Next Increment:</strong> ${getIncrementForPrice(auction.currentPrice || 0)}</p>

                        <p><strong>Status:</strong> {auction.biddingStatus}</p>
                    </div>
                    <div>
                        <p><strong>Start:</strong> {auction.startTime ? new Date(auction.startTime).toLocaleString() : 'N/A'}</p>
                        <p><strong>End:</strong> {auction.endTime ? new Date(auction.endTime).toLocaleString() : 'N/A'}</p>

                        <p><strong>Terms:</strong> {auction.termsId?.title || 'N/A'}</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mt-6">Description</h2>
                    <p>{auction.detailDescription || auction.simpleDescription}</p>
                </div>

                {user ? (
                    <div className="mt-4 space-y-2">
                        <label className="block font-semibold">Enter Your Bid:</label>
                        <input
                            type="number"
                            min={nextBid}
                            value={customBid}
                            placeholder={`Min $${nextBid}`}
                            onChange={(e) => setCustomBid(e.target.value)}
                            className="border p-2 rounded w-40"
                        />
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg ml-4"
                            onClick={placeBid}
                        >
                            {customBid ? `Place Bid $${customBid}` : `Place Bid $${nextBid}`}
                        </button>
                        {bidError && <p className="text-red-600 mt-2 text-sm">{bidError}</p>}
                    </div>
                ) : (
                    <p className="text-red-600 font-semibold mt-4">Please login to place a bid.</p>
                )}

            </div>


            {showLightbox && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <button
                        className="absolute top-4 right-6 text-white text-3xl"
                        onClick={() => setShowLightbox(false)}
                    >
                        &times;
                    </button>

                    <button
                        className="absolute left-4 text-white text-3xl"
                        onClick={() =>
                            setSelectedIndex((selectedIndex - 1 + auction.photos.length) % auction.photos.length)
                        }
                    >
                        &#8592;
                    </button>

                    <img
                        src={getFullImageUrl(auction.photos[selectedIndex].path)}
                        alt="Full View"
                        className="max-w-full max-h-[90vh] rounded shadow"
                    />

                    <button
                        className="absolute right-4 text-white text-3xl"
                        onClick={() =>
                            setSelectedIndex((selectedIndex + 1) % auction.photos.length)
                        }
                    >
                        &#8594;
                    </button>
                </div>
            )}

            <div className="mt-8 flex justify-center">
                <div className="w-full max-w-3xl">
                    <h2 className="text-xl font-semibold mb-4 text-center">Bid History</h2>
                    {auction.bidHistory && auction.bidHistory.length > 0 ? (
                        <table className="w-full border text-sm shadow-md rounded overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-3 text-left">User</th>
                                    <th className="border p-3 text-left">Bid Amount</th>
                                    <th className="border p-3 text-left">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...auction.bidHistory].reverse().map((bid, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="border p-3">{bid.userId?.firstName} {bid.userId?.lastName}</td>
                                        <td className="border p-3 font-semibold">${bid.amount}</td>
                                        <td className="border p-3">{new Date(bid.time || bid.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-center">No bids yet.</p>
                    )}
                </div>
            </div>





            <Footer />
        </>
    );
}
