import React, { useState, useEffect } from 'react';
import { api } from '../api';
import scrollToTop from '../utils/scrollToTop';
import { io } from 'socket.io-client';
const socket = io('auction-website-server-production.up.railway.app', {
    transports: ['websocket']
});

export default function Auctions() {
    const [activeSubgroup, setActiveSubgroup] = useState('Auctions');
    const [activeTab, setActiveTab] = useState('List');
    const [message, setMessage] = useState('');
    const [openBidIndex, setOpenBidIndex] = useState(null);
    const [selectedAuctionId, setSelectedAuctionId] = useState('');
    const [editForm, setEditForm] = useState({});


    const [auctionForm, setAuctionForm] = useState({
        name: '',
        published: false,
        private: false,
        status: 'pending',
        sortIndex: '',
        simpleDescription: '',
        description: '',
        tagLine: '',
        biddingStatus: 'Starting Soon',
        reserve: '',
        startingBid: 0,
        detailDescription: '',
        termsId: '',
        startTime: '',
        endTime: '',
        addToCalendar: false,
        details: '',
        photos: [],
        increments: [
            { from: 0, to: 100, increment: 5 },
            { from: 100, to: 300, increment: 10 }
        ],
    });
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeSubgroup === 'Auctions' && activeTab === 'List') {
                    const res = await api.get('/api/admin/auctions');
                    setAuctions(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [activeSubgroup, activeTab]);

    const handleAuctionFormChange = (e) => {
        const { name, value } = e.target;
        setAuctionForm({
            ...auctionForm,
            [name]: value
        });
    };


    const placeBid = async (auctionId, amount) => {
        try {
            const res = await api.post(`/api/admin/auctions/${auctionId}/bid`, {
                userId: 'mock-user-id', // Replace with actual user ID
                amount
            });

            // Emit bid to other clients
            socket.emit('placeBid', { auctionId, amount });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        // Listen for new bid broadcast
        socket.on('newBid', (data) => {
            setAuctions(prev =>
                prev.map(a => a._id === data.auctionId
                    ? { ...a, currentPrice: data.amount }
                    : a)
            );
        });

        return () => {
            socket.off('newBid');
        };
    }, []);

    const handleAuctionChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (name === 'photos') {
            setAuctionForm(prev => ({ ...prev, photos: Array.from(files) }));
        } else {
            setAuctionForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleAuctionSubmit = async (e) => {
        e.preventDefault();
        scrollToTop();
        try {
            const formData = new FormData();

            // API FIELDS
            formData.append('name', auctionForm.name);
            formData.append('published', auctionForm.published);
            formData.append('private', auctionForm.private);
            formData.append('status', auctionForm.status);
            formData.append('sortIndex', auctionForm.sortIndex);
            formData.append('simpleDescription', auctionForm.simpleDescription);
            formData.append('description', auctionForm.description);
            formData.append('tagLine', auctionForm.tagLine);
            formData.append('biddingStatus', auctionForm.biddingStatus);
            formData.append('reserve', auctionForm.reserve);
            formData.append('startingBid', auctionForm.startingBid);
            formData.append('buyNowPrice', auctionForm.buyNowPrice || 0);
            formData.append('detailDescription', auctionForm.detailDescription);
            formData.append('termsId', auctionForm.termsId);

            formData.append('startTime', new Date(auctionForm.startTime).toISOString());
            formData.append('endTime', new Date(auctionForm.endTime).toISOString());

            formData.append('details', auctionForm.details); // Not Used in update 1.0.0
            // formData.append('addToCalendar', auctionForm.addToCalendar); // Not Used in update 1.0.0

            // Append your photos (if any)
            for (let i = 0; i < auctionForm.photos.length; i++) {
                formData.append('photos', auctionForm.photos[i]);
            }

            formData.append('increments', JSON.stringify(auctionForm.increments));


            // Then submit your FormData
            await api.post('/api/admin/auctions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMessage('Auction created successfully!');
        } catch {
            setMessage('Failed to create auction.');
        }
    };


    const handleEditSelect = (e) => {
        const id = e.target.value;
        setSelectedAuctionId(id);
        const auction = auctions.find(a => a._id === id);
        if (auction) {
            setEditForm({
                name: auction.name,
                detailDescription: auction.detailDescription,
                reserve: auction.reserve,
                buyNowPrice: auction.buyNowPrice,
                startTime: auction.startTime ? new Date(auction.startTime).toISOString().slice(0, 16) : '',
                endTime: auction.endTime ? new Date(auction.endTime).toISOString().slice(0, 16) : '',
                biddingStatus: auction.biddingStatus
            });
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/admin/auctions/${selectedAuctionId}`, editForm);
            setMessage('Auction updated successfully.');
        } catch {
            setMessage('Failed to update auction.');
        }
    };


    const renderTabContent = () => {
        if (activeSubgroup === 'Auctions') {
            if (activeTab === 'List') {
                return (
                    <table className="w-full table-auto border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">Name</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Published</th>
                                <th className="p-2">Private</th>
                                <th className="p-2">Reserve</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auctions.map((a, i) => (
                                <React.Fragment key={a._id}>
                                    <tr className="border-t">
                                        <td className="p-2">{a.name}</td>
                                        <td className="p-2">{a.biddingStatus}</td>
                                        <td className="p-2">{a.startTime ? new Date(a.startTime).toLocaleString() : 'N/A'}</td>
                                        <td className="p-2">{a.endTime ? new Date(a.endTime).toLocaleString() : 'N/A'}</td>
                                        <td className="p-2">${a.reserve || 0}</td>
                                        <td className="p-2">
                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
                                                onClick={() => setOpenBidIndex(openBidIndex === i ? null : i)}
                                            >
                                                {openBidIndex === i ? 'Hide Bids' : 'View Bids'}
                                            </button>
                                        </td>
                                    </tr>

                                    {openBidIndex === i && a.bidHistory && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={6} className="p-4">
                                                <h4 className="font-semibold mb-2">Bid History</h4>
                                                {a.bidHistory.length > 0 ? (
                                                    <table className="w-full text-sm border">
                                                        <thead className="bg-gray-200">
                                                            <tr>
                                                                <th className="p-2 text-left">User</th>
                                                                <th className="p-2 text-left">Amount</th>
                                                                <th className="p-2 text-left">Time</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {[...a.bidHistory].reverse().map((b, idx) => (
                                                                <tr key={idx} className="border-t">
                                                                    <td className="p-2">{b.userId?.firstName || 'N/A'} {b.userId?.lastName || ''}</td>
                                                                    <td className="p-2">${b.amount}</td>
                                                                    <td className="p-2">{new Date(b.time || b.createdAt).toLocaleString()}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p>No bids yet.</p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}

                        </tbody>
                    </table>
                );
            }
            if (activeTab === 'Create') {
                return (
                    <form onSubmit={handleAuctionSubmit} className="grid gap-6" encType="multipart/form-data">
                        {/* SECTION: Auction Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" value={auctionForm.name} onChange={handleAuctionChange} placeholder="Auction Name *" className="border p-2 rounded" required />
                            <input name="tagLine" value={auctionForm.tagLine} onChange={handleAuctionChange} placeholder="Tag Line" className="border p-2 rounded" />
                        </div>

                        <textarea name="simpleDescription" value={auctionForm.simpleDescription} onChange={handleAuctionChange} placeholder="Short Summary" className="border p-2 rounded" rows="2" />
                        <textarea name="detailDescription" value={auctionForm.detailDescription} onChange={handleAuctionChange} placeholder="Detailed Description" className="border p-2 rounded" rows="4" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input name="reserve" type="number" value={auctionForm.reserve} onChange={handleAuctionChange} placeholder="Reserve Price ($)" className="border p-2 rounded" />
                            <input name="sortIndex" type="number" value={auctionForm.sortIndex} onChange={handleAuctionChange} placeholder="Sort Index" className="border p-2 rounded" />
                            <select name="termsId" value={auctionForm.termsId} onChange={handleAuctionChange} className="border p-2 rounded">
                                <option value="">Select Terms</option>
                                {/* Dynamically populate from backend later */}
                            </select>
                        </div>

                        <input
                            name="startingBid"
                            type="number"
                            value={auctionForm.startingBid || ''}
                            onChange={handleAuctionChange}
                            placeholder="Starting bid amount ($)"
                            className="border p-2 rounded"
                        />

                        <input
                            type="number"
                            name="buyNowPrice"
                            value={auctionForm.buyNowPrice || ''}
                            onChange={handleAuctionChange}
                            placeholder="Buy It Now Price"
                            className="border p-2 rounded"
                        />


                        {/* SECTION: Timing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label>
                                Start Time
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={auctionForm.startTime}
                                    onChange={handleAuctionFormChange}
                                    className="border p-2 rounded"
                                />
                            </label>
                            <label>
                                End Time
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={auctionForm.endTime}
                                    onChange={handleAuctionFormChange}
                                    className="border p-2 rounded"
                                />
                            </label>
                        </div>

                        {/* SECTION: Media */}
                        <div>
                            <label className="font-semibold">Upload Photos</label>
                            <input type="file" name="photos" multiple onChange={handleAuctionChange} className="border p-2 rounded w-full" />
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {auctionForm.photos.length > 0 && Array.from(auctionForm.photos).map((photo, idx) => (
                                    <img key={idx} src={URL.createObjectURL(photo)} alt="Preview" className="h-20 rounded shadow" />
                                ))}
                            </div>
                        </div>

                        {/* SECTION: Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select name="biddingStatus" value={auctionForm.biddingStatus} onChange={handleAuctionChange} className="border p-2 rounded">
                                <option value="Starting Soon">Starting Soon</option>
                                <option value="Accepting Bids">Accepting Bids</option>
                                <option value="Paused">Paused</option>
                                <option value="Closed">Closed</option>
                            </select>

                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="published" checked={auctionForm.published} onChange={handleAuctionChange} />
                                Published
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="private" checked={auctionForm.private} onChange={handleAuctionChange} />
                                Private
                            </label>
                        </div>

                        <h3 className="font-semibold text-lg mt-6">Bid Increments</h3>

                        {/* Labels */}
                        <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-700 mb-1">
                            <label>From:</label>
                            <label>To:</label>
                            <label>Increment:</label>
                            <span></span> {/* Empty column for delete button */}
                        </div>

                        {/* Input Rows */}
                        {auctionForm.increments.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-4 gap-4 mb-2 items-center">
                                <input
                                    type="number"
                                    name="from"
                                    placeholder="From"
                                    value={row.from}
                                    onChange={(e) => {
                                        const newInc = [...auctionForm.increments];
                                        newInc[idx].from = parseFloat(e.target.value);
                                        setAuctionForm({ ...auctionForm, increments: newInc });
                                    }}
                                    className="border p-2 rounded"
                                    required
                                />
                                <input
                                    type="number"
                                    name="to"
                                    placeholder="To"
                                    value={row.to}
                                    onChange={(e) => {
                                        const newInc = [...auctionForm.increments];
                                        newInc[idx].to = parseFloat(e.target.value);
                                        setAuctionForm({ ...auctionForm, increments: newInc });
                                    }}
                                    className="border p-2 rounded"
                                    required
                                />
                                <input
                                    type="number"
                                    name="increment"
                                    placeholder="Increment"
                                    value={row.increment}
                                    onChange={(e) => {
                                        const newInc = [...auctionForm.increments];
                                        newInc[idx].increment = parseFloat(e.target.value);
                                        setAuctionForm({ ...auctionForm, increments: newInc });
                                    }}
                                    className="border p-2 rounded"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = auctionForm.increments.filter((_, i) => i !== idx);
                                        setAuctionForm({ ...auctionForm, increments: updated });
                                    }}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        {/* Add More Rows Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setAuctionForm({
                                    ...auctionForm,
                                    increments: [...auctionForm.increments, { from: 0, to: 0, increment: 0 }]
                                });
                            }}
                            className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                        >
                            + Add Row
                        </button>



                        {/* SUBMIT */}
                        <div className="flex gap-2">
                            <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Create Auction</button>
                            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setAuctionForm({ name: '', published: false, private: false, status: 'pending', sortIndex: '', simpleDescription: '', description: '', tagLine: '', biddingStatus: 'Starting Soon', reserve: '', detailDescription: '', termsId: '', startTime: '', endTime: '', addToCalendar: false, details: '', photos: [] })}>Cancel</button>
                        </div>

                        {message && <p className="text-blue-700 font-semibold">{message}</p>}
                    </form>
                );
            }

            if (activeTab === 'Edit') {
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Edit Auction</h2>
                        <select onChange={handleEditSelect} value={selectedAuctionId} className="border p-2 rounded w-full">
                            <option value="">Select an Auction</option>
                            {auctions.map(a => (
                                <option key={a._id} value={a._id}>{a.name}</option>
                            ))}
                        </select>

                        {selectedAuctionId && (
                            <form onSubmit={handleEditSubmit} className="grid gap-4">
                                <input name="name" value={editForm.name || ''} onChange={handleEditChange} placeholder="Auction Name" className="border p-2 rounded" />
                                <textarea name="detailDescription" value={editForm.detailDescription || ''} onChange={handleEditChange} placeholder="Description" className="border p-2 rounded" />
                                <input name="reserve" type="number" value={editForm.reserve || ''} onChange={handleEditChange} placeholder="Reserve Price" className="border p-2 rounded" />
                                <input name="buyNowPrice" type="number" value={editForm.buyNowPrice || ''} onChange={handleEditChange} placeholder="Buy Now Price" className="border p-2 rounded" />
                                <input name="startTime" type="datetime-local" value={editForm.startTime} onChange={handleEditChange} className="border p-2 rounded" />
                                <input name="endTime" type="datetime-local" value={editForm.endTime} onChange={handleEditChange} className="border p-2 rounded" />
                                <select name="biddingStatus" value={editForm.biddingStatus || ''} onChange={handleEditChange} className="border p-2 rounded">
                                    <option value="Starting Soon">Starting Soon</option>
                                    <option value="Accepting Bids">Accepting Bids</option>
                                    <option value="Paused">Paused</option>
                                    <option value="Closed">Closed</option>
                                </select>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
                            </form>
                        )}
                    </div>
                );
            }



        }
        if (activeSubgroup === 'Terms & Conditions') {
            return <p>Terms & Conditions tab coming soon.</p>;
        }
        if (activeSubgroup === 'Bid History') {
            return <p>Bid History tab coming soon.</p>;
        }
        return <p>Select a tab.</p>;
    };

    return (
        <div className="px-6 py-6">
            <h1 className="text-3xl font-bold mb-6">Auctions</h1>
            <div className="flex gap-3 mb-4">
                {['Auctions', 'Terms & Conditions', 'Bid History'].map((group) => (
                    <button key={group} onClick={() => { setActiveSubgroup(group); setActiveTab('List'); }} className={`px-4 py-2 rounded ${activeSubgroup === group ? 'bg-blue-700 text-white' : 'bg-white border'}`}>
                        {group}
                    </button>
                ))}
            </div>
            <div className="flex gap-2 mb-4">
                {['List', 'Create', 'Edit', 'Export'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1 rounded text-sm ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                        {tab}
                    </button>
                ))}
            </div>
            <div className="bg-white p-6 rounded shadow">
                {message && <p className="text-blue-700 font-semibold mb-4">{message}</p>}
                {renderTabContent()}
            </div>
        </div>

    );
}
