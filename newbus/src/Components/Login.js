import React from 'react';
import { LuBus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../CSS/Login.css';  // Make sure to create and import this CSS file

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const obj = {
      email: email,
      password: password
    };

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        alert('Successfully logged in');
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-container">
      

        <div className="login-form-container">
          <form className="login-form" method="POST" onSubmit={handleSubmit}>
            <div className="input-group">
        
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
              />
            </div>
            <a
                href="#forgot-password"
                className="forgot-password"
                onClick={() => navigate('/forgotpassword')}
              >
                Forgot password?
              </a>
            <div className="login-actions">
              
              <button type="submit" className="submit-button">Sign in</button>
            </div>
          </form>
<br />
          <div className="signup-option">
            <p>Don't have an account?</p>
            <button onClick={() => navigate('/signup')} className="signup-button">Sign Up</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
