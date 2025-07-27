import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SecureData.css';

const SecureData = () => {
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      try {
        // Fetch user data
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(userResponse.data);

        // Fetch appointments (after user data is fetched)
        const appointmentsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/bookings?userId=${userResponse.data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAppointments(appointmentsResponse.data);
      } catch (appointmentError) {
        setError('Error fetching data');
        console.error(appointmentError);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="secure-data-container">
      <h2>Secure Data</h2>
      {error && <p className="error-message">{error}</p>}
      {userData && (
        <div className="user-info">
          <h3>Your Information</h3>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role}</p>
        </div>
      )}
      <div className="appointments">
        <h3>Customer Appointment History</h3>
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <p><strong>Appointment Time:</strong> {new Date(appointment.bookingTime).toLocaleString()}</p>
                <p><strong>Booked By:</strong> {appointment.user.name} ({appointment.user.email})</p>
                <p><strong>Notes:</strong> {appointment.notes || 'No notes provided'}</p>
                <p><strong>Stylist:</strong> {appointment.stylist.name}</p>
                <p><strong>Service:</strong> {appointment.service.name}</p>
                <hr />
              </li>
            ))}
          </ul>
        ) : (
          <p>No past appointments</p>
        )}
      </div>
    </div>
  );
};

export default SecureData;
