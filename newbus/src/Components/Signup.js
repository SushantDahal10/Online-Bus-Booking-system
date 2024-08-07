import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../CSS/Signup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
export default function Signup() {
    const [otpSent, setOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(60);
    const [otp, setOtp] = useState('');
    const [otpButtonEnabled, setOtpButtonEnabled] = useState(true);
    const [otpVerified, setOtpVerified] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); 
    const navigate = useNavigate();

    const handlesubmit = async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmpsw = document.getElementById('confirm-password').value;

        if (!otpSent) {
            alert('Please send OTP first');
            return;
        }

        if (!otpVerified) {
            alert('Please verify the OTP first');
            return;
        }

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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
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

    const handleSendOtp = async () => {
        const email = document.getElementById('email').value;
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit OTP
        setOtp(generatedOtp);

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sendSignupOtp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp: generatedOtp })
        });

        if (response.ok) {
            setOtpSent(true);
            setOtpButtonEnabled(false);
            setEmailExists(false);
            const timer = setInterval(() => {
                setOtpTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        setOtpButtonEnabled(true);
                        setOtpTimer(60);
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            const errorData = await response.json();
            if (errorData.message === 'Email already exists') {
                setEmailExists(true);
                alert('Email already exists');
            } else {
                alert(errorData.message);
            }
        }
    };

    const handleVerifyOtp = async () => {
        const email = document.getElementById('email').value;
        const enteredOtp = document.getElementById('otp').value;

        const otpVerificationResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/verifySignupOtp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp: enteredOtp })
        });

        if (!otpVerificationResponse.ok) {
            const errorData = await otpVerificationResponse.json();
            alert(errorData.message);
            return;
        }

        setOtpVerified(true);
        alert('OTP verified successfully');
    };

    return (
        <>
            <Navbar />
            <div className="signup-container">
                <div className="signup-form-container">
                    <form className="signup-form" method='post' onSubmit={handlesubmit}>
                        <div className="input-group1">
                            <input type="email" name="email" id="email" placeholder="name@company.com" required />
                        </div>
                        <div className="input-group1">
                            <div className="password-container">
                                <input 
                                    type={passwordVisible ? "text" : "password"} 
                                    name="password" 
                                    id="password" 
                                    placeholder="Password" 
                                    required 
                                />
                                <span 
                                    className="toggle-password" 
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <div className="input-group1">
                            <div className="password-container">
                                <input 
                                    type={confirmPasswordVisible ? "text" : "password"} 
                                    name="confirm-password" 
                                    id="confirm-password" 
                                    placeholder="Re-enter password" 
                                    required 
                                />
                                <span 
                                    className="toggle-password" 
                                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                >
                                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <div className="otp-container">
                            {!otpSent ? (
                                <button type="button" className="submit-button1" onClick={handleSendOtp} disabled={!otpButtonEnabled}>
                                    Send OTP
                                </button>
                            ) : otpVerified ? (
                                <>
                                    <p>OTP Verified</p>
                                </>
                            ) : (
                                <>
                                    <div className="input-group1">
                                        <input type="text" name="otp" id="otp" placeholder="Enter OTP" required />
                                    </div>
                                    <button type="button" className="submit-button1" onClick={handleSendOtp} disabled={!otpButtonEnabled}>
                                        Send OTP ({otpTimer}s)
                                    </button>
                                    <button type="button" className="submit-button1" onClick={handleVerifyOtp} disabled={otpVerified}>
                                        Verify OTP
                                    </button>
                                </>
                            )}
                        </div>
                        <button type="submit" className="submit-button1" disabled={!otpVerified}>Create an account</button>
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