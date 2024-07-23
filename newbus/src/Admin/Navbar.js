import React from 'react';
import './Admincss/Navbar.css';

export default function Navbar({ handleSectionChange }) {
  return (
    <div className="navbar">
      <div className="nav-item" onClick={() => handleSectionChange('dashboard')}>Dashboard</div>
      <div className="nav-item" onClick={() => handleSectionChange('bus')}>Bus Details</div>
      <div className="nav-item" onClick={() => handleSectionChange('travel')}>Travel Details</div>
      <div className="nav-item" onClick={() => handleSectionChange('booking')}>Bookings</div>
    </div>
  );
}
