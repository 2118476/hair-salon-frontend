import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';
 // Add a basic CSS file for styling

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response ? error.response.data : 'An error occurred');
            console.error(error);
        }
    };

    return (
        <div className="forgot-password-container">
    <h2>Forgot Your Password?</h2>
    <p>No worries! Enter your email below to receive a link to reset your password.</p>
   
        <div className="form-container">
            
            <form className="form" onSubmit={handleForgotPassword}>
            <h2>Forgot Your Password?</h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <button type="submit">Send Reset Link</button>
                {message && <p className="message">{message}</p>}
            </form>
            
        </div>
       
</div>
    );
}

export default ForgotPassword;
