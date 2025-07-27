import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StylistManagement.css';

function StylistManagement() {
    const [stylists, setStylists] = useState([]);
    const [name, setName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [availability, setAvailability] = useState('');
    const [editingStylist, setEditingStylist] = useState(null);

    useEffect(() => {
        fetchStylists();
    }, []);

    const fetchStylists = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stylists`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStylists(response.data);
        } catch (error) {
            console.error('Error fetching stylists', error);
        }
    };

    const handleAddOrUpdateStylist = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editingStylist) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/stylists/${editingStylist.id}`, { name, specialization, availability }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/stylists`, { name, specialization, availability }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            setName('');
            setSpecialization('');
            setAvailability('');
            setEditingStylist(null);
            fetchStylists();
        } catch (error) {
            console.error('Error adding or updating stylist', error);
        }
    };

    const handleEditStylist = (stylist) => {
        setName(stylist.name);
        setSpecialization(stylist.specialization);
        setAvailability(stylist.availability);
        setEditingStylist(stylist);
    };

    const handleDeleteStylist = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/stylists/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchStylists();
        } catch (error) {
            console.error('Error deleting stylist', error);
        }
    };

    return (
        <div className="stylist-management">
            <h2>Manage Stylists</h2>
            <form onSubmit={handleAddOrUpdateStylist}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Specialization" required />
                <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Availability" required />
                <button type="submit">{editingStylist ? 'Update Stylist' : 'Add Stylist'}</button>
            </form>
            <ul>
                {stylists.map((stylist) => (
                    <li key={stylist.id}>
                        {stylist.name} - {stylist.specialization} - {stylist.availability}
                        <button onClick={() => handleEditStylist(stylist)}>Edit</button>
                        <button onClick={() => handleDeleteStylist(stylist.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StylistManagement;
