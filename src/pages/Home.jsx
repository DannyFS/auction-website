// src/pages/Home.jsx  
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';  
import Navbar from '../components/Navbar';  
import Footer from '../components/Footer';  
import heroVideo from '../assets/homepage-hero.mp4';
import beachPoster from '../assets/beach.jpg';

export default function Home() {
    const [auctions, setAuctions] = useState([]);

   useEffect(() => {  
       // Call the backend to increase the view count  
       fetch('https://auction-website-server-production.up.railway.app/api/admin/website/visitor-count', { method: 'POST' })
       .then(response => {  
           if (!response.ok) {  
               console.error('Failed to update viewer count');  
           }  
       })  
           .catch(error => console.error('Error:', error));  
       fetch('https://auction-website-server-production.up.railway.app/api/admin/auctions')
           .then(res => res.json())
           .then(data => setAuctions(data))
           .catch(err => console.error('Failed to load auctions:', err));
   }, []);  

   const upcoming = auctions.filter(a => a.biddingStatus === 'Starting Soon');
   const current = auctions.filter(a => a.biddingStatus === 'Accepting Bids');

   return (  
       <>  
           <Header />  
           <Navbar />  

           <div  
               className="w-full bg-black overflow-shwon relative"  
               style={{  
                   height: 'calc(100vw * 0.5625)',  
                   maxHeight: 'calc(100dvh - 163px)',  
               }}  
           >  
               <video
                   className="absolute top-0 left-0 w-full h-full object-cover z-0"
                   autoPlay
                   loop
                   muted
                   playsInline
                   poster={beachPoster} // Fallback image if video doesn't load
                   onError={(e) => console.error('Video failed to load:', e)}
               >
                   <source src={heroVideo} type="video/mp4" />
                   {/* Graceful fallback text */}
                   Your browser does not support the video tag.
               </video>

               {/* Dark overlay for contrast */}  
               <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>  

               {/* Bottom-left welcome text */}  
               <div className="absolute bottom-6 left-6 z-20 animate-fadeIn">  
                   <a  
                       href="/#auctions-start"  
                       className="hover:underline text-white font-bold text-xl md:text-3xl py-4 px-8 rounded-lg shadow-lg transition duration-300"  
                   >  
                       Welcome to Carolina Investor Auction  
                   </a>  
               </div>  
           </div>  

           <div id="auctions-start" className="bg-white py-20 px-6 space-y-10">
               <section>
                   <h2 className="text-[#004aad] text-3xl font-semibold mb-4">Current Auctions</h2>
                   {current.length ? (
                       <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                           {current.map(a => (
                               <div key={a._id} className="border rounded shadow p-4 space-y-2">
                                   <h3
                                       className="text-lg font-bold text-blue-700 cursor-pointer hover:underline"
                                       onClick={() => window.location.href = `/auction/${a._id}`}
                                   >
                                       {a.name}
                                   </h3>
                                   <p>{a.tagLine}</p>
                                   <p><strong>Current Bid:</strong> ${a.currentPrice || 0}</p>
                                   <p><strong>Ends:</strong> {new Date(a.endTime).toLocaleString()}</p>                               </div>
                           ))}
                       </div>
                   ) : <p className="text-gray-600">No live auctions right now.</p>}
               </section>
           </div>

           <Footer />  
       </>  
   );  
}