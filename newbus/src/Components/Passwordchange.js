import React, { useEffect, useState } from 'react';
import '../CSS/Passwordchange.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Passwordchange() {
    const [email, setEmail] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminToken = async () => {
            try {
                const res = await fetch('http://localhost:8000/admintokencheck', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!res.ok) {
                    setError('Please log in again.');
                    setIsAuthorized(false);
                    return;
                }

                const data = await res.json();
                console.log('Token is valid:', data);
                setEmail(data.email); // Set email if needed
                setIsAuthorized(true);
            } catch (err) {
                console.error('Error checking token:', err);
                setError('An error occurred while checking token. Please try again.');
                setIsAuthorized(false);
            }
        };

        checkAdminToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const reenterPassword = document.getElementById('reenter-password').value;

        if (password !== reenterPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const obj = { email, password };
            const res = await fetch('http://localhost:8000/passwordchange', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(obj)
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                navigate('/login');
            } else {
                const errorData = await res.json();
                alert(errorData.message);
            }
        } catch (err) {
            console.log(err);
            alert('An error occurred. Please try again.');
        }
    }

    if (!isAuthorized) {
        return (
            <>
            <Navbar></Navbar>
            <div className="error-message">
                <p>{error}</p>
                {error === 'Please log in again.' && (
                    <button onClick={() => navigate('/login')} className="login-button">
                        Go to Login
                    </button>
                )}
            </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="password-change-container">
                <form className="password-change-form" onSubmit={handleSubmit}>
                    <h2>Change Password</h2>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reenter-password">Re-enter Password</label>
                        <input type="password" id="reenter-password" name="reenter-password" required />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
}
