import React, { useState, useEffect } from 'react';  
import { api } from '../api';

export default function Website() {  
   const [activeSubgroup, setActiveSubgroup] = useState('Stats');  
    const [visitorCount, setVisitorCount] = useState(0);  
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');

   useEffect(() => {  
       const fetchVisitorCount = async () => {  
           try {  
               const response = await api.get('/api/admin/website/visitor-count'); 
               setVisitorCount(response.data.count);  
           } catch (error) {  
               console.error('Error fetching visitor count:', error);  
           }  
       };  

       if (typeof window !== 'undefined') {  
           fetchVisitorCount();  
       }

       const fetchQuestions = async () => {
           try {
               const res = await api.get('/api/admin/website/questionnaire');
               setQuestions(res.data || []);
           } catch (err) {
               console.error('Failed to fetch questions:', err);
           }
       };

       if (typeof window !== 'undefined') {
           fetchVisitorCount();
           fetchQuestions();
       }
   }, []);  

   const renderTabContent = () => {  
       if (activeSubgroup === 'Stats') {  
           return (  
               <div>  
                   <h2 className="text-xl font-semibold mb-4">Website Stats</h2>  
                   <p>  
                       <strong>Visitor Count:</strong> {visitorCount}  
                   </p>  
               </div>  
           );  
       }
       if (activeSubgroup === 'Questionnaire') {
           return (
               <div className="space-y-4">
                   <h2 className="text-xl font-semibold">User Registration Questionnaire</h2>

                   <form
                       onSubmit={async (e) => {
                           e.preventDefault();
                           if (!newQuestion.trim()) return;
                           const updated = [...questions, newQuestion.trim()];
                           try {
                               await api.post('/api/admin/website/questionnaire', { questions: updated });
                               setQuestions(updated);
                               setNewQuestion('');
                           } catch (err) {
                               console.error('Failed to save question:', err);
                           }
                       }}
                       className="flex gap-2"
                   >
                       <input
                           type="text"
                           value={newQuestion}
                           onChange={(e) => setNewQuestion(e.target.value)}
                           placeholder="Enter a new question..."
                           className="flex-1 border p-2 rounded"
                       />
                       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                   </form>

                   <ul className="list-disc list-inside">
                       {questions.map((q, idx) => (
                           <li key={idx} className="flex justify-between items-center">
                               {q}
                               <button
                                   onClick={async () => {
                                       const updated = questions.filter((_, i) => i !== idx);
                                       try {
                                           await api.post('/api/admin/website/questionnaire', { questions: updated });
                                           setQuestions(updated);
                                       } catch (err) {
                                           console.error('Delete failed:', err);
                                       }
                                   }}
                                   className="text-sm text-red-600 hover:underline"
                               >
                                   Remove
                               </button>
                           </li>
                       ))}
                   </ul>
               </div>
           );
       }


       return null;  
   };  

   return (  
       <div className="px-6 py-6">  
           <h1 className="text-3xl font-bold mb-6">Website</h1>  

           <div className="flex gap-3 mb-4">  
               {['Stats', 'Questionnaire'].map((group) => (  
                   <button  
                       key={group}  
                       onClick={() => { setActiveSubgroup(group); }}  
                       className={`px-4 py-2 rounded ${activeSubgroup === group ? 'bg-blue-700 text-white' : 'bg-white border'}`}  
                   >  
                       {group}  
                   </button>  
               ))}  
           </div>  

           {/* Main Content */}  
           <div className="bg-white p-6 rounded shadow">  
               {renderTabContent()}  
           </div>  
       </div>  
   );  
}
