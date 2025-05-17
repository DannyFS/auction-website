import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function OurApp() {
    return (
        <>
            <Header />
            <Navbar />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Our App</h1>
                <p className="mb-4">
                    Carolina Investor Auction is a cutting-edge platform designed to revolutionize the way you participate in online auctions. Our app offers a seamless and user-friendly experience, empowering you to bid boldly and win brilliantly.
                </p>
                <p>
                    With features like real-time bidding updates, secure payment processing, and a wide range of auction categories, our app ensures that you never miss out on an opportunity to snag your dream item. Whether you're a seasoned bidder or new to the auction scene, Carolina Investor Auction has everything you need to make your auction experience enjoyable and successful.
                </p>
            </div>

            <Footer />
        </>
    );
}

export default OurApp;