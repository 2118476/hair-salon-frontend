// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

const Navbar = ({ userName }) => { // Receive userName as a prop
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState(window.location.pathname);

    const handleNavLinkClick = (path) => {
        setActiveLink(path);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header className="navbar">
            <div className="logo-container">
                <img src="/images/logo-for-barbershop-men-s-hairstyle-salon-stylish-man-with-haircut-beard-and-mustaches-vector.jpg" alt="Barbershop Logo" className="logo" />
                <div className="logo-and-name">
                    <Link to="/" className="salon-name-link">
                        <h1 className="salon-name">Stylus Studio</h1>
                    </Link>
                </div>
            </div>
            <nav className="nav-links">
                <ul>
                    {!localStorage.getItem('token') ? (
                        <>
                            <li>
                                <Link to="/" onClick={() => handleNavLinkClick('/')} className={activeLink === '/' ? 'active' : ''}>Home</Link>
                            </li>
                            <li>
                                <Link to="/register" onClick={() => handleNavLinkClick('/register')} className={activeLink === '/register' ? 'active' : ''}>Register</Link>
                            </li>
                            <li>
                                <Link to="/login" onClick={() => handleNavLinkClick('/login')} className={activeLink === '/login' ? 'active' : ''}>Login</Link>
                            </li>
                            <li>
                                <Link to="/forgot-password" onClick={() => handleNavLinkClick('/forgot-password')} className={activeLink === '/forgot-password' ? 'active' : ''}>Forgot Password</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/" onClick={() => handleNavLinkClick('/')} className={activeLink === '/' ? 'active' : ''}>Home</Link>
                            </li>
                            <li>
                                <Link to="/services" onClick={() => handleNavLinkClick('/services')} className={activeLink === '/services' ? 'active' : ''}>Services</Link>
                            </li>
                            <li>
                                <Link to="/bookings" onClick={() => handleNavLinkClick('/bookings')} className={activeLink === '/bookings' ? 'active' : ''}>Manage Bookings</Link>
                            </li>
                            {localStorage.getItem('role') === 'ADMIN' && (
                                <>
                                    <li>
                                        <Link to="/admin" onClick={() => handleNavLinkClick('/admin')} className={activeLink === '/admin' ? 'active' : ''}>Manage Services</Link>
                                    </li>
                                    <li>
                                        <Link to="/stylist-management" onClick={() => handleNavLinkClick('/stylist-management')} className={activeLink === '/stylist-management' ? 'active' : ''}>Manage Stylists</Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/user-management" onClick={() => handleNavLinkClick('/admin/user-management')} className={activeLink === '/admin/user-management' ? 'active' : ''}>Manage Users</Link>
                                    </li>
                                    <li>
                                        <Link to="/secure-data" onClick={() => handleNavLinkClick('/secure-data')} className={activeLink === '/secure-data' ? 'active' : ''}>Secure Data</Link>
                                    </li>
                                </>
                            )}
                            {localStorage.getItem('role') === 'MODERATOR' && (
                                <>
                                    <li>
                                        <Link to="/moderator" onClick={() => handleNavLinkClick('/moderator')} className={activeLink === '/moderator' ? 'active' : ''}>Moderator Dashboard</Link>
                                    </li>
                                    <li>
                                        <Link to="/secure-data" onClick={() => handleNavLinkClick('/secure-data')} className={activeLink === '/secure-data' ? 'active' : ''}>Secure Data</Link>
                                    </li>
                                </>
                            )}
                            <li>
                                {userName && (
                                    <span style={{ marginRight: 10, color: '#00A550' }}>
                                        Hello, {userName}
                                    </span>
                                )}
                                <button onClick={handleLogout} className="logout-button">Logout</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
