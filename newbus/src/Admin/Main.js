import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './Admincss/Main.css';
import Dashboard from './Dashboard';
import Booking from './Booking';
import BusDetail from './Busdetail';
import TravelDetail from './Travel';
import { useNavigate } from 'react-router-dom';

export default function Main() {
  const [section, setSection] = useState('dashboard');
  const [totalBus, setTotalBus] = useState();
  const [dashboardData, setDashboardData] = useState({});
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/admindetail', {
          credentials: 'include'
        });

        if (response.status === 401) {
          setUnauthorized(true);
          return;
        }

        const data = await response.json();
        setDashboardData(data.result[0]);

        const operatorResponse = await fetch('http://localhost:8000/totaloperators', {
          credentials: 'include'
        });

        if (operatorResponse.status === 401) {
          setUnauthorized(true);
          return;
        }

        const operatorData = await operatorResponse.json();
        setTotalBus(operatorData.result[0].totaloperator);
      } catch (err) {
        console.log('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

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
        {section === 'dashboard' && (
          <Dashboard
            bookingCount={dashboardData.bookingcount}
            totalRevenue={dashboardData.totalrevenue}
            totalBus={totalBus}
          />
        )}
        {section === 'bus' && <BusDetail />}
        {section === 'travel' && <TravelDetail />}
        {section === 'booking' && <Booking />}
      </div>
    </div>
  );
}
