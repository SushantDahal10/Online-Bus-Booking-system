import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admincss/Dashboard.css';
import Navbar from './Navbar';
const Dashboard = ({ bookingCount, totalRevenue, totalBus }) => {
  
  const navigate = useNavigate();

  const handleSectionChange = (newSection) => {
    navigate(`/admin/${newSection}`);
  };
  return (
    <div className="dashboard">
         <Navbar handleSectionChange={handleSectionChange} />
      <h1>Dashboard</h1>
      <div className="cards">
        <div className="card red">
          <h2>Total Booking</h2>
          <p>{bookingCount}</p>
        </div>
        <div className="card blue">
          <h2>Payment Received</h2>
          <p>{totalRevenue}</p>
        </div>
        <div className="card teal">
          <h2>CANCEL</h2>
          <p>18740</p>
        </div>
        <div className="card blue">
          <h2>Operator</h2>
          <p>{totalBus}</p>
        </div>
        <div className="card teal">
          <h2>City</h2>
          <p>331</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
