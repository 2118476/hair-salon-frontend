// src/components/BookingManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingManagement.css';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [stylists, setStylists] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [error, setError] = useState(null);
    const [editDetails, setEditDetails] = useState({
        bookingId: null,
        serviceId: null,
        stylistId: null,
        bookingTime: '',
        notes: ''
    });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userId = localStorage.getItem('userId');
                const userBookings = response.data.filter(booking => booking.user.id === parseInt(userId));
                setBookings(userBookings);
                setError(null);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setError('Error fetching bookings');
            }
        };

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

        const fetchStylists = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stylists`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStylists(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching stylists:', error);
                setError('Error fetching stylists');
            }
        };

        fetchBookings();
        fetchServices();
        fetchStylists();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleCheckAvailability = async () => {
        if (!editDetails.stylistId || !editDetails.bookingTime) {
            setError('Please select a stylist and a valid booking time.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const date = new Date(editDetails.bookingTime).toISOString().split('T')[0];
            const startTime = new Date(`${date}T09:00:00Z`).toISOString(); // Convert to UTC
            const endTime = new Date(`${date}T18:00:00Z`).toISOString(); // Convert to UTC

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/available-slots`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    stylistId: editDetails.stylistId,
                    startTime,
                    endTime,
                },
            });

            setAvailableSlots(response.data);
            if (response.data.length === 0) {
                setError('No available slots for the selected date and stylist.');
            } else {
                setError(null);
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            setError('Error checking availability. Please try again later.');
        }
    };

    const handleUpdateBooking = async () => {
        if (!availableSlots.includes(editDetails.bookingTime)) {
            alert('The selected time slot is not available. Please choose a different time.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const { bookingId, serviceId, stylistId, bookingTime, notes } = editDetails;
            await axios.put(`${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    serviceId: serviceId,
                    stylistId: stylistId,
                    bookingTime: new Date(bookingTime).toISOString(), // Send time in UTC
                    notes: notes,
                },
            });
            alert('Booking updated successfully!');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userId = localStorage.getItem('userId');
            const userBookings = response.data.filter(booking => booking.user.id === parseInt(userId));
            setBookings(userBookings);
            setEditDetails({
                bookingId: null,
                serviceId: null,
                stylistId: null,
                bookingTime: '',
                notes: ''
            });
            setAvailableSlots([]); // Reset available slots after update
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Error updating booking');
        }
    };

    const handleEditClick = (booking) => {
        setEditDetails({
            bookingId: booking.id,
            serviceId: booking.service?.id || '',
            stylistId: booking.stylist?.id || '',
            bookingTime: booking.bookingTime,
            notes: booking.notes || ''
        });
        setAvailableSlots([]); // Clear available slots when starting a new edit
    };

    const handleCancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
        if (confirmCancel) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('Booking canceled successfully!');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userId = localStorage.getItem('userId');
                const userBookings = response.data.filter(booking => booking.user.id === parseInt(userId));
                setBookings(userBookings);
            } catch (error) {
                console.error('Error canceling booking:', error);
                alert('Error canceling booking');
            }
        }
    };

    return (
        <div className="bookings-container">
            <h2>Manage Your Bookings</h2>
            {error && <p>{error}</p>}
            <ul className="bookings-list">
                {bookings.map(booking => (
                    <li key={booking.id} className="booking-item">
                        <h3>Booking ID: {booking.id}</h3>
                        <p>Service: {booking.service?.name || 'N/A'}</p>
                        <p>Stylist: {booking.stylist?.name || 'N/A'}</p>
                        <p>Time: {new Date(booking.bookingTime).toLocaleString()}</p>
                        <p>Notes: {booking.notes || 'None'}</p>
                        <div className="booking-buttons">
                            <button onClick={() => handleEditClick(booking)}>Edit</button>
                            <button onClick={() => handleCancelBooking(booking.id)}>Cancel</button>
                        </div>
                    </li>
                ))}
            </ul>
            {editDetails.bookingId && (
                <div className="booking-form">
                    <h3>Edit Booking</h3>
                    <label>
                        Choose Service:
                        <select name="serviceId" value={editDetails.serviceId} onChange={handleInputChange}>
                            <option value="">Select a service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Choose Stylist:
                        <select name="stylistId" value={editDetails.stylistId} onChange={handleInputChange}>
                            <option value="">Select a stylist</option>
                            {stylists.map(stylist => (
                                <option key={stylist.id} value={stylist.id}>{stylist.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Choose Date and Time:
                        <input type="datetime-local" name="bookingTime" value={editDetails.bookingTime} onChange={handleInputChange} />
                    </label>
                    <button onClick={handleCheckAvailability}>Check Availability</button>
                    <div className="available-slots">
                        {availableSlots.map(slot => (
                            <button 
                                key={slot} 
                                className={editDetails.bookingTime === slot ? 'slot-button selected' : 'slot-button'} 
                                onClick={() => handleInputChange({ target: { name: 'bookingTime', value: slot } })}
                                disabled={new Date(slot) < new Date()}
                            >
                                {new Date(slot).toLocaleString()}
                            </button>
                        ))}
                    </div>
                    <label>
                        Notes:
                        <textarea name="notes" value={editDetails.notes} onChange={handleInputChange} />
                    </label>
                    <button onClick={handleUpdateBooking}>Update Booking</button>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;
