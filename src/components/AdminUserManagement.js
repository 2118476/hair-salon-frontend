// src/components/AdminUserManagement.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users: ' + (error.response ? error.response.data : error.message));
        }
    };

    useEffect(() => {
        fetchUsers();  // Call fetchUsers on component mount
    }, []);

    const promoteToAdmin = async (userId) => {
        const confirmPromotion = window.confirm("Are you sure you want to promote this user to admin?");
        if (!confirmPromotion) return;

        const token = localStorage.getItem('token');
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/promote/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('User promoted to admin successfully');
            fetchUsers();  // Refresh the list of users
        } catch (error) {
            console.error('Error promoting user to admin:', error);
            alert('Failed to promote user to admin: ' + (error.response ? error.response.data : error.message));
        }
    };

    const demoteFromAdmin = async (userId) => {
        const confirmDemotion = window.confirm("Are you sure you want to demote this admin to user?");
        if (!confirmDemotion) return;

        const token = localStorage.getItem('token');
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/demote/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Admin demoted to user successfully');
            fetchUsers();  // Refresh the list of users
        } catch (error) {
            console.error('Error demoting admin to user:', error);
            alert('Failed to demote admin to user: ' + (error.response ? error.response.data : error.message));
        }
    };

    const promoteToModerator = async (userId) => {
        const confirmPromotion = window.confirm("Are you sure you want to promote this user to moderator?");
        if (!confirmPromotion) return;

        const token = localStorage.getItem('token');
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/promote-to-moderator/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('User promoted to moderator successfully');
            fetchUsers();  // Refresh the list of users
        } catch (error) {
            console.error('Error promoting user to moderator:', error);
            alert('Failed to promote user to moderator: ' + (error.response ? error.response.data : error.message));
        }
    };

    const demoteFromModerator = async (userId) => {
        const confirmDemotion = window.confirm("Are you sure you want to demote this moderator to user?");
        if (!confirmDemotion) return;

        const token = localStorage.getItem('token');
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/demote-to-user/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Moderator demoted to user successfully');
            fetchUsers();  // Refresh the list of users
        } catch (error) {
            console.error('Error demoting moderator to user:', error);
            alert('Failed to demote moderator to user: ' + (error.response ? error.response.data : error.message));
        }
    };

    const demoteFromAdminToModerator = async (userId) => {
        const confirmDemotion = window.confirm("Are you sure you want to demote this admin to moderator?");
        if (!confirmDemotion) return;

        const token = localStorage.getItem('token');
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/demote-admin-to-moderator/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Admin demoted to moderator successfully');
            fetchUsers();  // Refresh the list of users
        } catch (error) {
            console.error('Error demoting admin to moderator:', error);
            alert('Failed to demote admin to moderator: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <div className="admin-user-management">
             <h1>Manage Users</h1>  <h3>(Only Admin can access this)</h3>
            {error && <p className="error">{error}</p>}
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.email} - Role: {user.role}
                        {user.role === 'USER' && (
                            <>
                                <button onClick={() => promoteToAdmin(user.id)}>Promote to Admin</button>
                                <button onClick={() => promoteToModerator(user.id)}>Promote to Moderator</button>
                            </>
                        )}
                        {user.role === 'ADMIN' && (
                            <>
                                <button onClick={() => demoteFromAdmin(user.id)}>Demote to User</button>
                                <button onClick={() => demoteFromAdminToModerator(user.id)}>Demote to Moderator</button>
                            </>
                        )}
                        {user.role === 'MODERATOR' && (
                            <>
                                <button onClick={() => promoteToAdmin(user.id)}>Promote to Admin</button>
                                <button onClick={() => demoteFromModerator(user.id)}>Demote to User</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminUserManagement;
