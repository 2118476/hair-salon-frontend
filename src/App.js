// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SecureData from './components/SecureData';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Admin from './components/Admin';
import StylistManagement from './components/StylistManagement';
import ServiceList from './components/ServiceList';
import BookingManagement from './components/BookingManagement';
import LandingPage from './components/LandingPage';
import AdminUserManagement from './components/AdminUserManagement';
import Moderator from './components/Moderator';
import Footer from './components/Footer';
import Navbar from './components/Navbar'; // Import Navbar component
import CreateAdmin from './components/CreateAdmin';

import './styles.css';


function App() {
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

    useEffect(() => {
        const handleStorage = () => {
            setUserName(localStorage.getItem('userName') || '');
        };

        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    return (
        <div className="App">
            <Navbar userName={userName} /> {/* Pass userName as a prop */}
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setUserName={setUserName} />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/services" element={<ServiceList />} />
                    <Route path="/create-admin" element={<CreateAdmin />} />
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MODERATOR']} />}>
                        <Route path="/secure-data" element={<SecureData />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/stylist-management" element={<StylistManagement />} />
                        <Route path="/admin/user-management" element={<AdminUserManagement />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'MODERATOR']} />}>
                        <Route path="/bookings" element={<BookingManagement />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={['MODERATOR']} />}>
                        <Route path="/moderator" element={<Moderator />} />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

function WrappedApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default WrappedApp;
