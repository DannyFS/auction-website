import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
function Results() {
    return (
        <>
            <Header />
            <Navbar />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Auction Results</h1>
                {/* TODO: Insert past auction results here */}
            </div>

            <Footer />
        </>
    );
}

export default Results;
