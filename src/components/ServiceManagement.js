import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiceManagement.css';

function ServiceManagement() {
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [editingService, setEditingService] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/services`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices(response.data);
            console.log("Fetched services:", response.data); // Log fetched data
        } catch (error) {
            console.error('Error fetching services:', error.response || error);
            alert('Failed to fetch services. Please try again later.');
        }
    };

    const handleAddOrUpdateService = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
       
        try {
            if (editingService) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/services/${editingService.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/services`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            resetForm();
            fetchServices();
            alert('Service saved successfully!');
        } catch (error) {
            console.error('Error adding or updating service:', error.response || error);
            alert('There was an error processing your request. Please try again.');
        }
    };
    
    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setEditingService(null);
    };

    const handleEditService = (service) => {
        setName(service.name);
        setDescription(service.description);
        setPrice(service.price);
        setEditingService(service);
    };

    const handleDeleteService = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/services/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchServices();
            alert('Service deleted successfully!');
        } catch (error) {
            console.error('Error deleting service:', error.response || error);
            alert('Failed to delete service. Please try again.');
        }
    };

 

    return (
        <div className="service-management">
            <h2>Manage Services</h2>
            <form onSubmit={handleAddOrUpdateService}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
                <button type="submit">{editingService ? 'Update Service' : 'Add Service'}</button>
            </form>
            <ul>
                {services.map(service => (
                    <li key={service.id}>

                        <div>
                            {service.name} - {service.description} - £{service.price.toFixed(2)}
                        </div>
                        <button onClick={() => handleEditService(service)}>Edit</button>
                        <button onClick={() => handleDeleteService(service.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ServiceManagement;
