// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Ensure your CSS file is correctly linked

const Footer = () => {
    return (
        <footer className="footer">
            <div className="social-media-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <img src="/images/Facebook_Logo_(2019).png" alt="Facebook" className="social-icon" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <img src="/images/twitter.png" alt="Twitter" className="social-icon" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <img src="/images/Instagram_logo_2016.svg.webp" alt="Instagram" className="social-icon" />
                </a>
            </div>
            <p>© {new Date().getFullYear()} Hair Salon. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
