import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ServiceBooking.css';

const ServiceBooking = ({ serviceId }) => {
    const [stylists, setStylists] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedStylist, setSelectedStylist] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStylists = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stylists`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStylists(response.data);
            } catch (error) {
                console.error('Error fetching stylists:', error);
                setError('Error fetching stylists');
            }
        };

        fetchStylists();
    }, []);

    const handleCheckAvailability = async () => {
        setError(null); // Reset error state before checking

        if (!selectedStylist) {
            setError('Please choose a stylist first.');
            return;
        }

        if (!date) {
            setError('Please choose a date first.');
            return;
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight to compare only the date

        if (selectedDate < today) {
            setError('Please choose a future date.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const startTime = new Date(`${date}T09:00:00Z`).toISOString(); // Convert to UTC
            const endTime = new Date(`${date}T18:00:00Z`).toISOString(); // Convert to UTC

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/available-slots`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    stylistId: selectedStylist,
                    startTime,
                    endTime,
                },
            });

            setAvailableSlots(response.data);
            if (response.data.length === 0) {
                setError('No available slots for the selected date and stylist.');
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            setError('Error checking availability. Please try again later.');
        }
    };

    const handleBookService = async () => {
        setError(null); // Reset error state before booking

        if (!selectedSlot) {
            setError('Please select a time slot first.');
            return;
        }

        if (!selectedStylist) {
            setError('Please choose a stylist first.');
            return;
        }

        if (!date) {
            setError('Please choose a date first.');
            return;
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight to compare only the date

        if (selectedDate < today) {
            setError('Please choose a future date.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const bookingTime = new Date(selectedSlot).toISOString(); // Send time in UTC

            await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    userId,
                    serviceId,
                    stylistId: selectedStylist,
                    bookingTime,
                    notes: notes || '', // Allow empty notes
                },
            });
            alert('Service booked successfully!');
        } catch (error) {
            console.error('Error booking service:', error);
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('Error booking service. Please try again later.');
            }
        }
    };

    return (
        <div className="service-booking-container">
            <h2>Book Service</h2>
            {error && <p className="error-message">{error}</p>}
            <label>
                Choose Stylist:
                <select value={selectedStylist} onChange={(e) => setSelectedStylist(e.target.value)}>
                    <option value="">Select a stylist</option>
                    {stylists.map(stylist => (
                        <option key={stylist.id} value={stylist.id}>{stylist.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Choose Date:
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <button onClick={handleCheckAvailability}>Check Availability</button>
            <div className="available-slots">
                {availableSlots.map(slot => (
                    <button 
                        key={slot} 
                        className={selectedSlot === slot ? 'slot-button selected' : 'slot-button'} 
                        onClick={() => setSelectedSlot(slot)}
                        disabled={new Date(slot) < new Date()}
                    >
                        {new Date(slot).toLocaleString()}
                    </button>
                ))}
            </div>
            <label>
                Notes (Optional):
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <button 
                onClick={handleBookService} 
                disabled={!selectedStylist || !date || !selectedSlot}
            >
                Confirm Booking
            </button>
        </div>
    );
};

export default ServiceBooking;
