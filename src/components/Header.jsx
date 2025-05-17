import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        location: '',
        acceptsTerms: false
    });
    const [error, setError] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    const { user, login, logout } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (isRegistering) {
            api.get('https://auction-website-server-production.up.railway.app/api/admin/website/questionnaire')
                .then(res => setQuestions(res.data || []))
                .catch(err => console.error('Failed to load questionnaire:', err));
        }
    }, [isRegistering]);



    const handleLoginChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('https://auction-website-server-production.up.railway.app/api/admin/users/login', {
                email: form.email,
                password: form.password
            });
            const { token, user } = res.data;

            login(token);
            setShowLogin(false);
            navigate(user.role === 'admin' ? '/admin-portal' : '/');
        } catch (err) {
            setError('Login failed: ' + (err.response?.data || err.message));
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const userData = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            phone: form.phone,
            location: form.location,
            acceptsTerms: form.acceptsTerms,
            role: 'user',
            questionnaireResponses: answers
        };

        try {
            await api.post('https://auction-website-server-production.up.railway.app/api/admin/users', userData);

            // Auto-login after registration
            const res = await api.post('https://auction-website-server-production.up.railway.app/api/admin/users/login', {
                email: form.email,
                password: form.password
            });

            const { token, user } = res.data;
            login(token);
            setShowLogin(false);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Registration failed.');
        }
    };

    return (
        <>
            <div className="w-full bg-[#212f3d] text-white text-sm flex justify-between px-6 py-2">
                <div>Bid Boldly, Win Brilliantly</div>
                <div className="flex gap-4 items-center">
                    <a href="/" className="hover:underline">Home</a>
                    <a href="tel:+18039843906" className="hover:underline">(803) 984-3906</a>
                    <a href="/contact" className="hover:underline">Contact</a>
                    {user ? (
                        <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs">Logout</button>
                    ) : (
                        <button onClick={() => setShowLogin(true)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs">Login</button>
                    )}
                </div>
            </div>

            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white text-black p-6 rounded shadow-lg w-full max-w-sm space-y-4 relative">
                        <button className="absolute top-2 right-3 text-gray-500" onClick={() => setShowLogin(false)}>&times;</button>
                        <h2 className="text-lg font-bold">{isRegistering ? 'Create Account' : 'Login'}</h2>

                        {isRegistering ? (
                            <form onSubmit={handleRegisterSubmit} className="space-y-3">
                                <input name="firstName" placeholder="First Name" required onChange={handleLoginChange} className="w-full border p-2 rounded" />
                                <input name="lastName" placeholder="Last Name" required onChange={handleLoginChange} className="w-full border p-2 rounded" />
                                <input name="email" type="email" placeholder="Email" required onChange={handleLoginChange} className="w-full border p-2 rounded" />
                                <input name="phone" placeholder="Phone" required onChange={handleLoginChange} className="w-full border p-2 rounded" />
                                <input name="location" placeholder="Location" required onChange={handleLoginChange} className="w-full border p-2 rounded" />
                                <input name="password" type="password" placeholder="Password" required onChange={handleLoginChange} className="w-full border p-2 rounded" />
                                <label className="text-sm flex gap-2 items-center">
                                    <input type="checkbox" name="acceptsTerms" required onChange={handleLoginChange} />
                                    I accept the Terms
                                </label>
                                {error && <p className="text-red-600 text-sm">{error}</p>}
                                {questions.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="font-semibold">Questionnaire</p>
                                        {questions.map((q, idx) => (
                                            <input
                                                key={idx}
                                                placeholder={q}
                                                required
                                                value={answers[q] || ''}
                                                className="w-full border p-2 rounded"
                                                onChange={e =>
                                                    setAnswers(prev => ({ ...prev, [q]: e.target.value }))
                                                }
                                            />
                                        ))}

                                    </div>
                                )}

                                <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded w-full">Create Account</button>
                                <p className="text-sm text-center text-gray-600 mt-2 cursor-pointer" onClick={() => setIsRegistering(false)}>
                                    Already have an account? <span className="underline">Login here</span>
                                </p>
                            </form>
                        ) : (
                            <form onSubmit={handleLoginSubmit} className="space-y-3">
                                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleLoginChange} required className="w-full border p-2 rounded" />
                                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleLoginChange} required className="w-full border p-2 rounded" />
                                {error && <p className="text-red-600 text-sm">{error}</p>}
                                <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded w-full">Login</button>
                                <p className="text-sm text-center text-gray-600 mt-2 cursor-pointer" onClick={() => setIsRegistering(true)}>
                                    New here? <span className="underline">Create an account</span>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
