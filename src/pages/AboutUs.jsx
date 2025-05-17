import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AboutUs() {
    return (
        <>
            <Header />
            <Navbar />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">About Us</h1>

                <img src="../assets/brochure_ss_1_carolina_investor_auction_.png" alt="Adam Hudson" className="w-full rounded shadow-md" />
                <img src="../assets/brochure_ss_2_carolina_investor_auction_.png" alt="Auction Team" className="w-full rounded shadow-md" />

                <p className="text-lg font-semibold mt-4">Adam Hudson - Auctioneer & Realtor</p>
                <p>Welcome to Carolina Investor Auction, where we bring together buyers and sellers for a seamless real estate experience. Our founder, Adam Hudson, is a seasoned auctioneer and realtor with a proven track record of success.</p>

                <h2 className="text-2xl font-bold mt-6">Our Mission</h2>
                <p>Our mission is to provide a transparent, efficient, and stress-free auction process that maximizes value for both sellers and buyers.</p>

                <h2 className="text-2xl font-bold mt-6">Why Choose Us?</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Results-Driven:</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>Quick Sales: We sold a property at 5206 N Ocean Blvd, Cherry Grove Beach, SC 29582, for $1,460,000 in just 30 days.</li>
                            <li>Competitive Bidding: Our auctions create urgency and competition, often leading to higher sale prices.</li>
                        </ul>
                    </li>
                    <li><strong>Professional Representation:</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>Guaranteed Expertise: Sellers get expert representation at no cost - we handle the sale, negotiations, and paperwork.</li>
                            <li>Transparent Commissions: We charge an 8% buyer's premium to ensure fairness and clarity.</li>
                        </ul>
                    </li>
                    <li><strong>Cost Savings:</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>No Seller Fees: Sellers pay nothing, and we cover realtor fees - no commissions or marketing costs.</li>
                        </ul>
                    </li>
                    <li><strong>Wide Reach:</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>Diverse Buyer Pool: We attract investors and international buyers, expanding your reach.</li>
                        </ul>
                    </li>
                    <li><strong>Stress-Free Process:</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>Simplified Transactions: Easier than traditional sales.</li>
                            <li>Elimination of Contingencies: Auctions are final, reducing fall-through risks.</li>
                        </ul>
                    </li>
                    <li><strong>Additional Benefits:</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>Cash Buyers: Less financing risk, faster closings.</li>
                            <li>Guaranteed Offers: Minimum offers give peace of mind.</li>
                            <li>Backup Offers: Reasonable backups help ensure success even if the top bidder backs out.</li>
                        </ul>
                    </li>
                </ul>

                <h2 className="text-2xl font-bold mt-6">Our Services</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>Real Estate Auctions: Dedicated focus for top pricing.</li>
                    <li>Professional Representation: Licensed agents ensure smooth, legal transactions.</li>
                    <li>Marketing Exposure: We market aggressively to drive maximum visibility and engagement.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-6">Contact Us</h2>
                <p><strong>Phone:</strong> 803-984-3906</p>
                <p><strong>Email:</strong> <a href="mailto:adam@ibuycarsandhouses.com" className="text-blue-600 underline">adam@ibuycarsandhouses.com</a></p>
                <p><strong>Website:</strong> <a href="/" className="text-blue-600 underline">Carolina Investor Auction</a></p>

                <p className="mt-4">Join us for our next auction and experience the benefits of a professional, transparent, and efficient real estate auction process.</p>
            </div>

            <Footer />
        </>
    );
}

export default AboutUs;