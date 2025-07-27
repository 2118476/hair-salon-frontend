import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './LandingPage.css';

const slides = [
    {
        image: '/images/1-the-ivy-league-mens-cut.webp',
        title: 'Welcome to Hair Salon Booking',
        text: 'Your beauty, our duty. Book your appointment now!',
    },
    {
        image: '/images/17c6e4ebc9de681eea7002f2b17a6e1a.jpg',
        title: 'Experience the Best Haircuts',
        text: 'Our stylists are here to give you the perfect look.',
    },
    {
        image: '/images/abcdaddaf0aefd5dd09e013d281337ba.jpg',
        title: 'Quality Products',
        text: 'We use only the best products for your hair.',
    },
];

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleBookNowClick = () => {
        // Check if the user is logged in
        if (localStorage.getItem('token')) {
            navigate('/services'); // Navigate to Services page if logged in
        } else {
            navigate('/login'); // Navigate to Login page if not logged in
        }
    };

    return (
        <div className="landing-page">
            <div className="slider">
                {slides.map((slide, index) => (
                    <div
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        key={index}
                    >
                        <img src={slide.image} alt={`Slide ${index + 1}`} className="hero-image" />
                        <div className="hero-text">
                            <h1>{slide.title}</h1>
                            <p>{slide.text}</p>
                        </div>
                    </div>
                ))}
                <div className="animated-text">
                    <p>Premier Men's Salon Experience!</p>
                </div>
                <button className="book-now-button" onClick={handleBookNowClick}>Book Now</button>
            </div>
            <div className="additional-info">
                <div className="info-section">
                    <h2>Our Address</h2>
                    <p>Kingston Ln, London, Uxbridge UB8 3PH</p>
                </div>
                <div className="info-section">
                    <h2>Contact Us</h2>
                    <p>Email: info@hairsalon.com</p>
                    <p>Phone: (+44) 456-7890</p>
                </div>
                <div className="info-section">
                    <h2>Opening Hours</h2>
                    <p>Monday - Friday: 9am - 6pm</p>
                    <p>Saturday: 10am - 6pm</p>
                    <p>Sunday: Closed</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
