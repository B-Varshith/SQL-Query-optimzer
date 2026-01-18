import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [credentials, setCredentials] = useState([]);
    const [formData, setFormData] = useState({
        connection_name: '',
        host: 'localhost',
        port: 5432,
        db_name: '',
        username: 'postgres',
        password: ''
    });
    const [message, setMessage] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/credentials');
            setCredentials(res.data);
        } catch (err) {
            console.error('Error fetching credentials:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/credentials', formData);
            setMessage('Credential added successfully!');
            setFormData({
                connection_name: '',
                host: 'localhost',
                port: 5432,
                db_name: '',
                username: 'postgres',
                password: ''
            });
            fetchCredentials();
        } catch (err) {
            setMessage('Error adding credential');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this credential?')) return;
        try {
            await axios.delete(`http://localhost:3000/api/credentials/${id}`);
            fetchCredentials();
        } catch (err) {
            console.error('Error deleting credential:', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Database Connection</h2>
                    {message && <p className="mb-4 text-green-400">{message}</p>}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="connection_name"
                            placeholder="Connection Name (e.g., My Local DB)"
                            value={formData.connection_name}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600"
                            required
                        />
                        <input
                            type="text"
                            name="host"
                            placeholder="Host"
                            value={formData.host}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600"
                            required
                        />
                        <input
                            type="number"
                            name="port"
                            placeholder="Port"
                            value={formData.port}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600"
                            required
                        />
                        <input
                            type="text"
                            name="db_name"
                            placeholder="Database Name"
                            value={formData.db_name}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600"
                            required
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600"
                            required
                        />
                        <button
                            type="submit"
                            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Save Credential
                        </button>
                    </form>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Your Saved Connections</h2>
                    {credentials.length === 0 ? (
                        <p className="text-gray-400">No credentials saved yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {credentials.map((cred) => (
                                <div key={cred.id} className="bg-gray-700 p-4 rounded flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{cred.connection_name}</h3>
                                        <p className="text-sm text-gray-300">
                                            {cred.username}@{cred.host}:{cred.port}/{cred.db_name}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate('/', { state: { credentialId: cred.id } })}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Use
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cred.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
