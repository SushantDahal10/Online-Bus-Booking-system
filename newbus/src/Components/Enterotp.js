import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../CSS/Otp.css';
import { useNavigate } from 'react-router-dom';

export default function Enterotp() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(''); // State to manage error messages
    const [isAuthorized, setIsAuthorized] = useState(false); // State to check if user is authorized
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }

        // Check if token is valid on component mount
        const checkToken = async () => {
            try {
                const res = await fetch('http://localhost:8000/tokencheck', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!res.ok) {
                    // Token is invalid or not present
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

        checkToken();
    }, []);

    const handlesubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        
        try {
            const otp = document.getElementById('otp').value;
            const obj = { otp, email };
            const res = await fetch('http://localhost:8000/verifyotp', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(obj),
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                navigate(`/changepassword?email=${email}`);
            } else {
                const errorData = await res.json();
                if (res.status === 401) {
                    setError('Please log in first.'); // Set error message for 401 status
                } else {
                    setError(errorData.message); // Set other error messages
                }
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError('An error occurred while verifying OTP. Please try again.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="enterotp-container">
                {isAuthorized ? (
                    <form className="enterotp-form" method='post' onSubmit={handlesubmit}>
                        <h2>Enter OTP</h2>
                        <div className="form-group">
                            <label htmlFor="otp">OTP</label>
                            <input type="text" id="otp" name="otp" maxLength="6" pattern="\d{6}" required />
                        </div>
                        <button type="submit">Verify</button>
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
