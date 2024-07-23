import React from 'react';
import { LuBus } from "react-icons/lu";
import '../CSS/Signup.css'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'
import Footer from './Footer'

export default function Signup() {
    const navigate = useNavigate();

    const handlesubmit = async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmpsw = document.getElementById('confirm-password').value;

        if (password !== confirmpsw) {
            alert('Passwords do not match');
            return;
        }

        if (password.length < 3) {
            alert('Password must be at least 3 characters');
            return;
        }

        const obj = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(obj)
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        }
    };

    return (<>
        <Navbar />
        <div className="signup-container">
        
            
            <div className="signup-form-container">
                <form className="signup-form" method='post' onSubmit={handlesubmit}>
                    <div className="input-group">
                      
                        <input type="email" name="email" id="email" placeholder="name@company.com" required />
                    </div>
                    <div className="input-group">
                       
                        <input type="password" name="password" id="password" placeholder="Password" required />
                    </div>
                    <div className="input-group">
                       
                        <input type="password" name="confirm-password" id="confirm-password" placeholder="Re-enter password" required />
                    </div>
                    <button type="submit" className="submit-button">Create an account</button>
                    <div className="signup-option">
                        <p>Already have an account? <a href="/login">Login here</a></p>
                    </div>
                </form>
            </div>
          
        </div>
        <Footer />
        </>
    );
}
