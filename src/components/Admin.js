import React from 'react';
import './Admin.css';  // Make sure the CSS file path is correct
import ServiceManagement from './ServiceManagement';
import StylistManagement from './StylistManagement';
import AdminUserManagement from './AdminUserManagement';

function Admin() {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
      </div>
      <div className="admin-module">
        <ServiceManagement />
      </div>
      <div className="admin-module">
        <StylistManagement />
      </div>
      <div className="admin-module">
        <AdminUserManagement />
      </div>
    </div>
  );
}

export default Admin;
