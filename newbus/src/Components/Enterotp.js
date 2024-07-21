import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../CSS/Otp.css';
import { useNavigate } from 'react-router-dom';

export default function Enterotp() {
    const [email, setEmail] = useState('');
    const Navigate=useNavigate()
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, []);
    
    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const otp = document.getElementById('otp').value;
            const obj = {
                otp: otp,
                email: email
            };
            const res = await fetch('http://localhost:8000/verifyotp', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(obj)
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message); 
                Navigate(`/changepassword?email=${email}`)
          
            } else {
                const errorData = await res.json();
                alert(errorData.message); 
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert("An error occurred while verifying OTP. Please try again.");
        }
    };
    
    return (
        <div>
            <Navbar />
            <div className="enterotp-container">
                <form className="enterotp-form" method='post' onSubmit={handlesubmit}>
                    <h2>Enter OTP</h2>
                    <div className="form-group">
                        <label htmlFor="otp">OTP</label>
                        <input type="text" id="otp" name="otp" maxLength="6" pattern="\d{6}" required />
                    </div>
                    <button type="submit">Verify</button>
                </form>
            </div>
        </div>
    );
}
