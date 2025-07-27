import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles.css';
// Ensure the CSS file is correctly linked

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { name, email, password });
            setMessage(response.data.message || 'Registered successfully! Please log in.'); 
        } catch (error) {
            // Check if the error response indicates that the email is already taken
            if (error.response && error.response.status === 400) {
                // Assume your API returns a 400 status code when the email is already taken
                setMessage(error.response.data || "Email is already taken!");
            } else {
                setMessage("There was an error registering!");
            }
            console.error(error);
        }
    };

    return (
        <div className="register-container">
            <h2>Register to unlock the full potential of our services.</h2>
           
            
            <div className="form-container">
           
                <form className="form" onSubmit={handleRegister}>
                <h2>Join Our Community</h2>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit">Register</button>
                    {message && <p className="message">{message}</p>}
                    <p className="register-link">
                        Already a member? <Link to="/login">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
