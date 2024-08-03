import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admincss/Booking.css';
import Navbar from './Navbar';

export default function Booking() {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [unauthorized, setUnauthorized] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 
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
                const sortedBookings = data.result.sort((a, b) => new Date(a.date_of_travel) - new Date(b.date_of_travel));
                setBookings(sortedBookings);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            }
            finally{
                setLoading(false)
            }
        };

        fetchBookings();
    }, []);
    const handleSectionChange = (newSection) => {
        navigate(`/admin/${newSection}`);
    };
    if (unauthorized) {
        return (
            <>
          
    
            <div className="unauthorized-container">
                <h1>Unauthorized</h1>
                <p>You are not authorized to view this page. Please log in.</p>
                <button onClick={() => navigate('/login')}>Login</button>
            </div>
            </>
        );
    }

  

    const filteredBookings = bookings.filter((booking) =>
        Object.values(booking).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    if (loading) {
        return (
   <div className="container-fluid loading-container">Loading...</div>
 );
}
    return (
        <>
     
        <div className="booking-container">
            <Navbar handleSectionChange={handleSectionChange} />
            <h1>Bookings</h1>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
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
        
                    {filteredBookings.map((booking, index) => (
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
                            <td>{booking.date_of_travel.split('T')[0]}</td>
                            <td>{booking.bus_number}</td>
                            <td>{booking.bus_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
}
