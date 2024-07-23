import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import '../CSS/Success.css';
import StyledTicketPDF from './Ticketpdf';

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const senddata = async () => {
      const obj = JSON.parse(localStorage.getItem('detailofpassengers'));
console.log(obj)
      if (!obj) {
      alert('No passenger details found in localStorage');
        return;
      }

      try {
       

        const response = await fetch('http://localhost:8000/savepassengerdetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
        },
          body:JSON.stringify(obj),
          credentials: 'include',
        });

        if (response.ok) {
          console.log('Passenger details saved successfully');
          setTimeout(() => {
            navigate('/');
          }, 5000);
        } else {
          alert('Failed to save passenger details');
        }
      } catch (err) {
      
        alert(`Error: ${err.message || err}`);
      }
    };
    senddata();
  }, []);

  return (
    <div className="success-container">
      <h1>Success</h1>
      <p>Your booking details have been successfully saved.</p>
      <p>You will be redirected to the home page shortly...</p>
      <p className="text-2xl font-bold underline">You can download your ticket from website</p>
    </div>
  );
}
