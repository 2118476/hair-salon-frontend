import React, { useState } from 'react';
import axios from 'axios';

function CreateAdmin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/setup/create-admin`, {
                name,
                email,
                password
            });
            setMessage(response.data || 'Admin created successfully!');
        } catch (error) {
            setMessage(error.response?.data || 'Error creating admin!');
        }
    };

    return (
        <div>
            <h2>Create Initial Admin</h2>
            <form onSubmit={handleCreateAdmin}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Create Admin</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateAdmin;
