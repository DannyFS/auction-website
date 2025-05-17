import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Results from './pages/Results';
import AboutUs from './pages/AboutUs';
import Charity from './pages/Charity';
import Contact from './pages/Contact';
import OurApp from './pages/OurApp';
import CurrentAuctions from './pages/CurrentAuctions';
import AuctionDetail from './pages/AuctionDetail';

// Admin Portal
import AdminPortal from './pages/AdminPortal';
import AdminRoute from './components/AdminRoute'; // Protected wrapper

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/results" element={<Results />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/charity" element={<Charity />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/our-app" element={<OurApp />} />
                <Route path="/current-auctions" element={<CurrentAuctions />} />
                <Route path="/auction/:id" element={<AuctionDetail />} />

                {/* Protected Admin Route */}
                <Route path="/admin-portal" element={
                    <AdminRoute>
                        <AdminPortal />
                    </AdminRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
