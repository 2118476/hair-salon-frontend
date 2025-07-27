import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles.css';

function Login({ setUserName }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('userId', response.data.userId);

            const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${response.data.token}` }
            });
            const userName = userResponse.data.name;
            localStorage.setItem('userName', userName);
            
            setUserName(userName);
            setMessage('Login successful');
            redirectUser(response.data.role);
        } catch (error) {
            setMessage('Invalid email or password');
            console.error(error);
        }
    };

    const redirectUser = (role) => {
        switch (role) {
            case 'ADMIN':
                navigate('/admin');
                break;
            case 'MODERATOR':
                navigate('/moderator');
                break;
            case 'USER':
                navigate('/services');
                break;
            default:
                navigate('/');
                break;
        }
    };

    return (
        <div className="login-container">
            <h2>Welcome Back!</h2>
            <p>Log in to continue where you left off.</p>
            <div className="form-container">
                <form className="form" onSubmit={handleLogin}>
                    <h2>Log in</h2>
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
                    <button type="submit">Login</button>
                    {message && <p className="message">{message}</p>}
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <p className="register-link">Don't have an account? <Link to="/register">Register here</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Login;
