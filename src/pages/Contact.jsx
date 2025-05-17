import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Contact() {
    return (
        <>
            <Header />
            <Navbar />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
                <p>Phone: (803) 984-3906</p>

                <p>Email: adam@ibuycarsandhouses.com</p>
            </div>

            <Footer />
        </>
    );
}

export default Contact;