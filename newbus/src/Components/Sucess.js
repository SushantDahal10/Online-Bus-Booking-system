import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Success.css';
import Navbar from './Navbar';

export default function Success() {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
          const checkAuthorization = async () => {
              try {
                  const response = await fetch('http://localhost:8000/admintokencheck', {
                      method: 'GET',
                      credentials: 'include',
                  });

                  if (response.ok) {
                      console.log('Token is valid');
                      sendData();
                  } else {
                      setAuthorized(false);
                      setLoading(false);
                  }
              } catch (err) {
                  console.error('Error checking token:', err);
                  setAuthorized(false);
                  setLoading(false);
              }
          };

        const sendData = async () => {
            const obj = JSON.parse(localStorage.getItem('detailofpassengers'));
            console.log(obj);

            if (!obj) {
                alert('No passenger details found in localStorage');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/savepassengerdetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(obj),
                    credentials: 'include',
                });

                if (response.ok) {
                    console.log('Passenger details saved successfully');
                    setTimeout(() => {
                        navigate('/');
                    }, 5000);
                } else {
                    alert('Failed to save passenger details');
                    setLoading(false);
                }
            } catch (err) {
                alert(`Error: ${err.message || err}`);
                setLoading(false);
            }
        };

        checkAuthorization();
    }, [navigate]);

    if (loading) {
        return (
            <div className="loading">Loading...</div>
        );
    }

    if (!authorized) {
        return (
          <>
          <Navbar></Navbar>
       
            <div className="error-message">
                <p>Please log in again to continue.</p>
                <button onClick={() => navigate('/login')} className="login-button">
                    Go to Login
                </button>
            </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="success-container">
                <h1>Success</h1>
                <p>Your booking details have been successfully saved.</p>
                <p>You will be redirected to the home page shortly...</p>
                <p className="text-2xl font-bold underline">You can download your ticket from the website</p>
            </div>
        </>
    );
}
