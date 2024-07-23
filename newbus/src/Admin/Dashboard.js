// Dashboard.js
import React from 'react';
import './Admincss/Dashboard.css';

const Dashboard = (props) => {
  const {bookingcount,totalrevenue,totalbus}=props;
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="cards">
        <div className="card red">
          <h2>Total Booking</h2>
          <p>{bookingcount}</p>
        </div>
        <div className="card blue">
          <h2>Payment Receive</h2>
          <p>{totalrevenue  }</p>
        </div>
       
        <div className="card teal">
          <h2>CANCEL</h2>
          <p>18740</p>
        </div>
       
       
        <div className="card blue">
          <h2>OPERATOR</h2>
          <p>{totalbus}</p>
        </div>
        <div className="card teal">
          <h2>CITY</h2>
          <p>331</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
