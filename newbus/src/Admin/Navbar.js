import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Admincss/Navbar.css';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ handleSectionChange }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admintokencheck`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          setIsLoggedIn(true); 
        } else {
          setIsLoggedIn(false); 
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setIsLoggedIn(false); 
      }
    };

    checkToken();
  }, []);

  const handleLogin = () => {
    navigate('/adminlogin');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      });
  
      if (response.ok) {
        setIsLoggedIn(false);
        navigate('/adminlogin');
      } else {
        console.error('Logout failed', response.statusText);
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="navbar">
      <div className="nav-item" onClick={() => handleSectionChange('dashboard')}>Dashboard</div>
      <div className="nav-item" onClick={() => handleSectionChange('bus')}>Bus Details</div>
      <div className="nav-item" onClick={() => handleSectionChange('travel')}>Travel Details</div>
      <div className="nav-item" onClick={() => handleSectionChange('booking')}>Bookings</div>
      <div className="nav-item" onClick={() => handleSectionChange('cities')}>Cities</div>
      <div className="nav-item account-icon" onClick={toggleDropdown}>
        <FaUserCircle size={24} />
        <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
          {isLoggedIn ? (
            <div className="dropdown-item" onClick={handleLogout}>Sign Out</div>
          ) : (
            <div className="dropdown-item" onClick={handleLogin}>Login</div>
          )}
        </div>
      </div>
    </div>
  );
}
