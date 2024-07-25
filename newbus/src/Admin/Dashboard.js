import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admincss/Dashboard.css';
import Navbar from './Navbar';

const Dashboard = ({ setUnauthorized }) => {
  const [dashboardData, setDashboardData] = useState({});
  const [totalBus, setTotalBus] = useState();
  const [totalCity, setTotalCity] = useState();
  const navigate = useNavigate();

  const handleSectionChange = (newSection) => {
    navigate(`/admin/${newSection}`);
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

        const cityResponse = await fetch('http://localhost:8000/totalcities', {
          credentials: 'include'
        });

        if (cityResponse.status === 401) {
          setUnauthorized(true);
          return;
        }

        const cityData = await cityResponse.json();
        setTotalCity(cityData.result[0].countcity);

      } catch (err) {
        console.log('Error fetching data:', err);
      }
    };

    fetchData();
  }, [setUnauthorized]);

  return (
    <div className="dashboard">
      <Navbar handleSectionChange={handleSectionChange} />
      <h1>Dashboard</h1>
      <div className="cards">
        <div className="card red">
          <h2>Total Booking</h2>
          <p>{dashboardData.bookingcount}</p>
        </div>
        <div className="card blue">
          <h2>Payment Received</h2>
          <p>{dashboardData.totalrevenue}</p>
        </div>
        {/* <div className="card teal">
          <h2>CANCEL</h2>
          <p>18740</p>
        </div> */}
        <div className="card blue">
          <h2>Operator</h2>
          <p>{totalBus}</p>
        </div>
        <div className="card teal">
          <h2>City</h2>
          <p>{totalCity}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
