import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admincss/Booking.css';

export default function Booking() {
    const [bookings, setBookings] = useState([]);
    const [unauthorized, setUnauthorized] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('http://localhost:8000/bookings', {
                    credentials: 'include'
                });

                if (res.status === 401) {
                    setUnauthorized(true);
                    return;
                }

                const data = await res.json();
                setBookings(data.result);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            }
        };

        fetchBookings();
    }, []);

    if (unauthorized) {
        return (
            <div className="unauthorized-container">
                <h1>Unauthorized</h1>
                <p>You are not authorized to view this page. Please log in.</p>
                <button onClick={() => navigate('/login')}>Login</button>
            </div>
        );
    }

    return (
        <div className="booking-container">
            <h1>Bookings</h1>
            <table className="booking-table">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Seat No</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Phone No</th>
                        <th>Price</th>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Fare</th>
                        <th>Date of Travel</th>
                        <th>Bus Number</th>
                        <th>Bus Name</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <tr key={index}>
                            <td>{booking.booking_id}</td>
                            <td>{booking.seat_no}</td>
                            <td>{booking.booking_email}</td>
                            <td>{booking.name}</td>
                            <td>{booking.age}</td>
                            <td>{booking.gender}</td>
                            <td>{booking.phone_no}</td>
                            <td>{booking.price}</td>
                            <td>{booking.source}</td>
                            <td>{booking.destination}</td>
                            <td>{booking.fare}</td>
                            <td>{booking.date_of_travel}</td>
                            <td>{booking.bus_number}</td>
                            <td>{booking.bus_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
