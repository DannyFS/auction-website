import React, { useState, useEffect } from 'react';
import { api } from '../api';
import scrollToTop from '../utils/scrollToTop';

export default function Company() {
    const [activeSubgroup, setActiveSubgroup] = useState('Settings');
    const [activeTab, setActiveTab] = useState('List');
    const [message, setMessage] = useState('');

    const [settings, setSettings] = useState({ name: '', phone: '', email: '', logo: null });
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);

    const [userForm, setUserForm] = useState({ firstName: '', lastName: '', email: '', phone: '', location: '' });
    const [permissionForm, setPermissionForm] = useState({ user: '', permissionType: '', receiveEmails: false });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeSubgroup === 'Settings') {
                    const res = await api.get('/api/admin/settings');
                    setSettings(prev => ({ ...prev, ...res.data }));
                } else if (activeSubgroup === 'Users' && activeTab === 'List') {
                    const res = await api.get('/api/admin/users');
                    setUsers(res.data);
                } else if (activeSubgroup === 'Permissions' && activeTab === 'List') {
                    const res = await api.get('/api/admin/permissions');
                    setPermissions(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [activeSubgroup, activeTab]);

    // --- Settings ---
    const handleSettingsChange = (e) => {
        const { name, value, files } = e.target;
        setSettings(prev => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        scrollToTop();
        try {
            const formData = new FormData();
            formData.append('name', settings.name);
            formData.append('phone', settings.phone);
            formData.append('email', settings.email);
            if (settings.logo) formData.append('logo', settings.logo);
            await api.post('/api/admin/settings', formData);
            setMessage('Settings updated successfully!');
        } catch {
            setMessage('Failed to update settings.');
        }
    };

    // --- Users ---
    const handleUserChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        scrollToTop();
        try {
            await api.post('/api/admin/users', userForm);
            setMessage('User created successfully!');
        } catch {
            setMessage('Failed to create user.');
        }
    };

    // --- Permissions ---
    const handlePermissionChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPermissionForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handlePermissionSubmit = async (e) => {
        e.preventDefault();
        scrollToTop();
        try {
            await api.post('/api/admin/permissions', permissionForm);
            setMessage('Permission saved successfully!');
        } catch {
            setMessage('Failed to save permission.');
        }
    };

    const renderTabContent = () => {
        if (activeSubgroup === 'Settings') {
            if (activeTab === 'List') {
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                        <p><strong>Name:</strong> {settings.name}</p>
                        <p><strong>Phone:</strong> {settings.phone}</p>
                        <p><strong>Email:</strong> {settings.email}</p>
                    </div>
                );
            }
            if (activeTab === 'Create') {
                return (
                    <form onSubmit={handleSettingsSubmit} className="grid gap-4">
                        <input name="name" value={settings.name} onChange={handleSettingsChange} placeholder="Company Name" className="border p-2 rounded" />
                        <input name="phone" value={settings.phone} onChange={handleSettingsChange} placeholder="Phone" className="border p-2 rounded" />
                        <input name="email" value={settings.email} onChange={handleSettingsChange} placeholder="Email" className="border p-2 rounded" />
                        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Save</button>
                    </form>
                );
            }
        }

        if (activeSubgroup === 'Users') {
            if (activeTab === 'List') {
                return (
                    <table className="w-full table-auto border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="border-t">
                                    <td className="p-2">{u.firstName} {u.lastName}</td>
                                    <td className="p-2">{u.email}</td>
                                    <td className="p-2">{u.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }
            if (activeTab === 'Create') {
                return (
                    <form onSubmit={handleUserSubmit} className="grid gap-4">
                        <input name="firstName" value={userForm.firstName} onChange={handleUserChange} placeholder="First Name" className="border p-2 rounded" />
                        <input name="lastName" value={userForm.lastName} onChange={handleUserChange} placeholder="Last Name" className="border p-2 rounded" />
                        <input name="email" value={userForm.email} onChange={handleUserChange} placeholder="Email" className="border p-2 rounded" />
                        <input name="phone" value={userForm.phone} onChange={handleUserChange} placeholder="Phone" className="border p-2 rounded" />
                        <input name="location" value={userForm.location} onChange={handleUserChange} placeholder="Address" className="border p-2 rounded" />

                        <input name="password" type="password" value={userForm.password || ''} onChange={handleUserChange} placeholder="Password (optional)" className="border p-2 rounded" />

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="acceptsTerms"
                                checked={!!userForm.acceptsTerms}
                                onChange={handleUserChange}
                            />
                            Accept Terms
                        </label>

                        <select name="role" value={userForm.role || 'user'} onChange={handleUserChange} className="border p-2 rounded">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>

                        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Create User</button>
                    </form>
                );
            }
        }

        if (activeSubgroup === 'Permissions') {
            if (activeTab === 'List') {
                return (
                    <table className="w-full table-auto border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">User</th>
                                <th className="p-2">Account</th>
                                <th className="p-2">Permission Type</th>
                                <th className="p-2">Receive Emails?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((p) => (
                                <tr key={p._id} className="border-t">
                                    <td className="p-2">{p.user}</td>
                                    <td className="p-2">{p.account || 'N/A'}</td>
                                    <td className="p-2">{p.permissionType}</td>
                                    <td className="p-2">{p.receiveEmails ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }
            if (activeTab === 'Create') {
                return (
                    <form onSubmit={handlePermissionSubmit} className="grid gap-4">
                        <input name="user" value={permissionForm.user} onChange={handlePermissionChange} placeholder="User *" className="border p-2 rounded" required />
                        <select name="permissionType" value={permissionForm.permissionType} onChange={handlePermissionChange} className="border p-2 rounded" required>
                            <option value="">Select Permission</option>
                            <option value="Full Admin">Full Admin</option>
                            <option value="Admin">Admin</option>
                            <option value="Clerk">Clerk</option>
                            <option value="Cataloger">Cataloger</option>
                            <option value="Consignor">Consignor</option>
                        </select>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="receiveEmails" checked={permissionForm.receiveEmails} onChange={handlePermissionChange} />
                            <label>Receive Emails?</label>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Save</button>
                            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setPermissionForm({ user: '', permissionType: '', receiveEmails: false })}>Cancel</button>
                        </div>
                    </form>
                );
            }
        }

        return <p>Select a tab.</p>;
    };

    return (
        <div className="px-6 py-6">
            <h1 className="text-3xl font-bold mb-6">Company</h1>

            {/* Subgroup Navigation */}
            <div className="flex gap-3 mb-4">
                {['Settings', 'Users', 'Permissions'].map((group) => (
                    <button key={group} onClick={() => { setActiveSubgroup(group); setActiveTab('List'); }} className={`px-4 py-2 rounded ${activeSubgroup === group ? 'bg-blue-700 text-white' : 'bg-white border'}`}>
                        {group}
                    </button>
                ))}
            </div>

            {/* Tab Buttons */}
            <div className="flex gap-2 mb-4">
                {['List', 'Create', 'Export'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1 rounded text-sm ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white p-6 rounded shadow">
                {message && <p className="text-blue-700 font-semibold mb-4">{message}</p>}
                {renderTabContent()}
            </div>
        </div>
    );
}
