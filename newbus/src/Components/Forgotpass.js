import React, { useState } from 'react';
import Navbar from './Navbar';
import '../CSS/Forgotpass.css';
import { useNavigate } from 'react-router-dom';

export default function Forgotpass() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Corrected function name

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById('email').value;
      const obj = { email };

      const response = await fetch('http://localhost:8000/verifyemail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (response.status === 202) {
          alert('opt sent to your ema il')
          navigate(`/otp?email=${email}`); 
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpObj = { email, otp };

          await fetch('http://localhost:8000/sendemail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(otpObj),
          });


        }
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="forgotpass-container">
        <form className="forgotpass-form" method="post" onSubmit={handlesubmit}>
          <h2>Forgot Password</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <button type="submit">Send Mail</button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
