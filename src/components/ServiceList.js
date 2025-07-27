import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceBooking from './ServiceBooking';
import './ServiceList.css';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [isBooking, setIsBooking] = useState(false);  // State to control the display of the booking component
    const [clickedServiceId, setClickedServiceId] = useState(null); // State to track clicked service ID

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/services`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setServices(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching services:', error);
                setError('Error fetching services');
            }
        };

        fetchServices();
    }, []);

    const handleBookServiceClick = (serviceId) => {
        setSelectedService(serviceId);
        setIsBooking(true);  // Set the booking state to true to display the booking form
        setClickedServiceId(serviceId); // Track which service was clicked
    };

    return (
        <div className="services-container">
            <h2>Available Services</h2>
            {error && <p className="error-message">{error}</p>}
            
            {/* Conditionally render the ServiceBooking component above the service list if isBooking is true */}
            {isBooking && selectedService && (
                <ServiceBooking serviceId={selectedService} />
            )}

            <ul className="services-list">
                {services.map(service => (
                    <li key={service.id} className="service-item">
                        <h3>{service.name}</h3>
                        {service.imageUrl && <img src={service.imageUrl} alt={service.name} className="service-image" />} {/* Display service image */}
                        <p>{service.description}</p>
                        <p>Price: £{service.price}</p>
                        <button
                            onClick={() => handleBookServiceClick(service.id)}
                            className={clickedServiceId === service.id ? 'active' : ''} // Apply active class if this button was clicked
                        >
                            Book Service
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServiceList;
