import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Website from '../admin/Website';
import Company from '../admin/Company';
import Auctions from '../admin/Auctions';
//import Marketing from '../admin/Marketing';
//import Invoicing from '../admin/Invoicing';
//import SellerSettlement from '../admin/SellerSettlement';
//import Reports from '../admin/Reports';
//import Imports from '../admin/Imports';
//import Exports from '../admin/Exports';

export default function AdminPortal() {
    const [activeSection, setActiveSection] = useState('Website');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');

        try {
            const decoded = jwtDecode(token);
            console.log('Token decoded:', decoded);

            if (decoded.role !== 'admin') return navigate('/');
        } catch (err) {
            console.error('Invalid token:', err);
            navigate('/');
        }
    }, []);


    const renderActiveGroup = () => {
        switch (activeSection) {
            case 'Website': return <Website />;
            case 'Company': return <Company />;
            case 'Auctions': return <Auctions />;
            //case 'Marketing': return <Marketing />;
            //case 'Invoicing': return <Invoicing />;
            //case 'Seller Settlement': return <SellerSettlement />;
            //case 'Reports': return <Reports />;
            //case 'Imports': return <Imports />;
            //case 'Exports': return <Exports />;
            default: return <p>Select an admin group.</p>;
        }
    };

    const sections = [
        'Website',
        'Company',
        'Auctions'/*,
        'Marketing',
        'Invoicing',
        'Seller Settlement',
        'Reports',
        'Imports',
        'Exports'*/
    ];

    return (
        <>
            <Header />
            <Navbar />

            <div className="min-h-screen bg-gray-100 px-6 py-6">
                <h1 className="text-3xl font-bold mb-6">Admin Portal</h1>

                {/* Admin Group Navigation */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {sections.map(section => (
                        <button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={`px-4 py-2 rounded ${activeSection === section ? 'bg-blue-700 text-white' : 'bg-white border'}`}
                        >
                            {section}
                        </button>
                    ))}
                </div>

                {/* Render Active Group */}
                <div className="bg-white p-6 rounded shadow">
                    {renderActiveGroup()}
                </div>
            </div>

            <Footer />
        </>
    );
}