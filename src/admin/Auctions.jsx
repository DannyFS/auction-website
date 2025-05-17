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
                            </tr>
                        </thead>
                        <tbody>
                            {auctions.map((a) => (
                                <tr key={a._id} className="border-t">
                                    <td className="p-2">{a.name}</td>
                                    <td className="p-2">{a.status}</td>
                                    <td className="p-2">{a.published ? 'Yes' : 'No'}</td>
                                    <td className="p-2">{a.private ? 'Yes' : 'No'}</td>
                                </tr>
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
                            type="number"
                            name="startingBid"
                            value={auctionForm.startingBid}
                            onChange={handleAuctionFormChange}
                            placeholder="Starting bid amount"
                            required
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
                {['List', 'Create', 'Export'].map((tab) => (
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
