import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import '../CSS/Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
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
        toast.success('Successfully logged in', {
          autoClose: 700, 
          onClose: () => {
              setTimeout(() => {
                  navigate('/');
              }, 0.02);  
          }
      });
      
      } else {
        const errorData = await response.json();
        toast.error(errorData.message,{
         
          autoClose: 900,
        });
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
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

            <div className="input-group password-group111">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle111"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
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
