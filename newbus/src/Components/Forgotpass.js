import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../CSS/Forgotpass.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Forgotpass() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // State to manage error messages
  const [isAuthorized, setIsAuthorized] = useState(false); // State to check if user is authorized
  const navigate = useNavigate(); 

  useEffect(() => {

    const checkAdminToken = async () => {
      try {
        const res = await fetch('http://localhost:8000/admintokencheck', {
          method: 'GET',
          credentials: 'include'
        });

        if (!res.ok) {
        
          setError('Please log in first.');
          setIsAuthorized(false);
          return;
        }

        const data = await res.json();
        console.log('Token is valid:', data);
        setIsAuthorized(true);
      } catch (err) {
        console.error('Error checking token:', err);
        setError('An error occurred while checking token. Please try again.');
        setIsAuthorized(false);
      }
    };

    checkAdminToken();
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 

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
          toast.success('OTP sent to your email', {
            autoClose: 600, 
            onClose: () => {
                setTimeout(() => {
                  navigate(`/otp?email=${email}`);
                }, 0.5);  
            }
        });
        
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
      <ToastContainer />
      <div className="forgotpass-container">
        {isAuthorized ? (
          <form className="forgotpass-form" method="post" onSubmit={handlesubmit}>
            <h2>Forgot Password</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <button type="submit">Send Mail</button>
            {message && <p className="message">{message}</p>}
          </form>
        ) : (
          <div className="error-message">
            <p>{error}</p>
            {error === 'Please log in first.' && (
              <button onClick={() => navigate('/login')} className="login-button">
                Go to Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
