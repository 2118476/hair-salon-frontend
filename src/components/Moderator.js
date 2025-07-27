import React from 'react';
import './Moderator.css'; // Make sure the CSS file path is correct
import ServiceManagement from './ServiceManagement';
import StylistManagement from './StylistManagement';

function Moderator() {
    return (
        <div className="moderator-container">
            <div className="moderator-header">
                <h2>Moderator Dashboard</h2>
            </div>
            <div className="management-module">
                <ServiceManagement />
            </div>
            <div className="management-module">
                <StylistManagement />
            </div>
        </div>
    );
}

export default Moderator;
