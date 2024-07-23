import React, { useState } from 'react';
import './Admincss/Adminlogin.css';

import { useNavigate } from 'react-router-dom';
export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
const Navigate=useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include' 
      });

      if (response.status === 200) {
        alert('Login successful');
        Navigate('/admin')
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };



  return (
    <>
  

    <div className="unique-admin-login-container">
      <h2 className="unique-login-heading">Admin Login</h2>
      <form className="unique-login-form" onSubmit={handleSubmit}>
        <div className="unique-form-group">
          <label htmlFor="email" className="unique-form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="unique-form-input"
            required
          />
        </div>
        <div className="unique-form-group">
          <label htmlFor="password" className="unique-form-label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="unique-form-input"
            required
          />
        </div>
        <button type="submit" className="unique-submit-button">Login</button>
      </form>
     
    </div>
    </>
  );
}
