import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './Admincss/Main.css';
import Dashboard from './Dashboard';
import Booking from './Booking';
import BusDetail from './Busdetail';
import TravelDetail from './Travel'

export default function Main() {
  const [bus, setBus] = useState(false);
  const [travel, setTravel] = useState(false);
  const [dashboard, setDashboard] = useState(true);
  const [booking, setBooking] = useState(false);
  const [totalBus, setTotalBus] = useState();
  const [dashboardData, setDashboardData] = useState({});
  
  const handleSectionChange = (section) => {
    setDashboard(section === 'dashboard');
    setBus(section === 'bus');
    setTravel(section === 'travel');
    setBooking(section === 'booking');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/admindetail');
        const operator = await fetch('http://localhost:8000/totaloperators');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data.result[0]);
        }
        if (operator.ok) {
          const operatorData = await operator.json();
          setTotalBus(operatorData.result[0].totaloperator);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Navbar handleSectionChange={handleSectionChange} />
      <div className="content">
        {dashboard && (
          <Dashboard bookingCount={dashboardData.bookingcount} totalRevenue={dashboardData.totalrevenue} totalBus={totalBus} />
        )}
        {bus && <BusDetail />}
        {travel && <TravelDetail />} {/* Use TravelDetail component here */}
        {booking && <Booking />}
      </div>
    </div>
  );
}
