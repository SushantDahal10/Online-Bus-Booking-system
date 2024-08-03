import React, { useState } from 'react';
import Navbar from './Navbar';
import './Admincss/Main.css';
import Dashboard from './Dashboard';
import Booking from './Booking';
import BusDetail from './Busdetail';
import TravelDetail from './Travel';
import { useNavigate } from 'react-router-dom';

export default function Main() {
  const [section, setSection] = useState('dashboard');
  
  const [unauthorized, setUnauthorized] = useState(false);
  const navigate = useNavigate();

  const handleSectionChange = (newSection) => {
    setSection(newSection);
    switch (newSection) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'travel':
        navigate('/admin/travel');
        break;
      case 'bus':
        navigate('/admin/bus');
        break;
      case 'booking':
        navigate('/admin/booking');
        break;
      default:
        navigate('/admin');
        break;
    }
  };

  if (unauthorized) {
    return (
      <>
        <Navbar handleSectionChange={handleSectionChange} />
        <div className="unauthorized-container">
          <h1>Unauthorized</h1>
          <p>You are not authorized to view this page. Please log in.</p>
          <button onClick={() => navigate('/adminlogin')}>Login</button>
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar handleSectionChange={handleSectionChange} />
      <div className="content">
        {section === 'dashboard' && <Dashboard setUnauthorized={setUnauthorized} />}
        {section === 'bus' && <BusDetail />}
        {section === 'travel' && <TravelDetail />}
        {section === 'booking' && <Booking />}
      </div>
    </div>
  );
}
