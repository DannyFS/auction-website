import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { io } from 'socket.io-client';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const socket = io('auction-website-server-production.up.railway.app', {
    transports: ['websocket']
});
export default function CurrentAuctions() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const res = await api.get('/api/admin/auctions');
                const active = res.data.filter(a => a.biddingStatus === 'Accepting Bids');
                setAuctions(active);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchAuctions();

        socket.on('newBid', ({ auctionId, amount }) => {
            setAuctions(prev =>
                prev.map(a =>
                    a._id === auctionId ? { ...a, currentPrice: amount } : a
                )
            );
        });

        return () => {
            socket.off('newBid');
        };
    }, []);

    const placeBid = async (auctionId, currentPrice) => {
        if (!user) return alert('Login required to bid.');

        const bidAmount = currentPrice + 100;

        try {
            await api.post(`/api/admin/auctions/${auctionId}/bid`, {
                userId: user.id,
                amount: bidAmount
            });

            socket.emit('placeBid', { auctionId, amount: bidAmount });
        } catch (err) {
            alert('Bid failed: ' + (err.response?.data || err.message));
        }
    };

    return (
        <>
            <Header />
            <Navbar />
            <div className="p-8 max-w-6xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-blue-700 mb-4">Live Auctions</h1>

                {loading ? (
                    <p>Loading auctions...</p>
                ) : auctions.length === 0 ? (
                    <p>No live auctions accepting bids at the moment.</p>
                ) : (
                    auctions.map((a) => {
                        const highestBid = a.currentPrice || 0;
                        return (
                            <div key={a._id} className="border p-6 rounded shadow bg-white space-y-2">
                                <Link to={`/auction/${a._id}`}>
                                    <h2 className="text-2xl font-semibold text-[#004aad] hover:underline cursor-pointer">{a.name}</h2>
                                </Link>
                                <p className="text-sm italic text-gray-600">{a.tagLine}</p>
                                <p>{a.simpleDescription || a.detailDescription}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                                    <div>
                                        {/*<p><strong>Reserve Price:</strong> ${a.reserve || 0}</p>*/}
                                        <p><strong>Current Highest Bid:</strong> ${highestBid}</p>
                                    </div>
                                    <div>
                                        <p><strong>Status:</strong> {a.biddingStatus}</p>
                                        <p><strong>Start:</strong> {a.startTime ? new Date(a.startTime).toLocaleString() : 'N/A'}</p>
                                        <p><strong>End:</strong> {a.endTime ? new Date(a.endTime).toLocaleString() : 'N/A'}</p>

                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <Footer />
        </>
    );
}
