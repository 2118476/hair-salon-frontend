import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ResetPassword.css';  // Import the CSS file

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            console.log('Sending reset password request', { email, token, newPassword });
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, { email, token, newPassword });
            console.log('Reset password response:', response);
            setMessage(response.data);
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage(error.response ? error.response.data : 'An error occurred');
        }
    };

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleResetPassword}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default ResetPassword;
