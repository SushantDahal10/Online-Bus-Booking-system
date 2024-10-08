import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Cancel.css'; // Make sure to create this CSS file
import Navbar from './Navbar';
export default function Cancel() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/viewseat');
    }, 5000); 
  }, [navigate]);

  return (
    <>
    <Navbar></Navbar>
    
    <div className="cancel-container">
      <h1>Payment Failed</h1>
      <p>Unfortunately, your payment could not be processed.</p>
      <p>You will be redirected to the seat selection page shortly...</p>
    </div>
    </>
  );
}
