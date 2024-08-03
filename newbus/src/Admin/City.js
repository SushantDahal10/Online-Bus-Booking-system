import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admincss/City.css';
import Navbar from './Navbar';
import ConfirmationModal from './Confirmdelete';
export default function City() {
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [unauthorized, setUnauthorized] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [busToDelete, setBusToDelete] = useState(null);
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch('http://localhost:8000/admin/cities', {
                    credentials: 'include'
                });

                if (res.status === 401) {
                    setUnauthorized(true);
                    return;
                }

                const data = await res.json();
                setCities(data.result);
            } catch (err) {
                console.error('Error fetching cities:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    const handleSectionChange = (newSection) => {
        navigate(`/admin/${newSection}`);
    };

    const handleAddCity = async () => {
        if (newCity.trim() === '') {
            alert('City name cannot be empty');
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/admin/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ city_name: newCity })
            });

            if (res.status === 201) {
                const data = await res.json();
                setCities([...cities, data.result]);
                setNewCity('');
            } else if (res.status === 401) {
                setUnauthorized(true);
            } else {
                alert('Failed to add city');
            }
        } catch (err) {
            console.error('Error adding city:', err);
        }
    };
    const  handleDeleteCity = (bus_number) => {
        setBusToDelete(bus_number);
        setShowModal(true);
    };
   
    const confirmDelete = async () => {
        setShowModal(false)
        try {
            const res = await fetch(`http://localhost:8000/admin/cities/${busToDelete}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.status === 200) {
                setCities(cities.filter(city => city.city_id !== busToDelete));
            } else if (res.status === 401) {
                setUnauthorized(true);
            } else {
                alert('Failed to delete city');
            }
        } catch (err) {
            console.error('Error deleting city:', err);
        }
    };
    const cancelDelete = () => {
        setShowModal(false);
        setBusToDelete(null);
    };

    if (unauthorized) {
        return (
            <div className="unauthorized-container">     
                <h1>Unauthorized</h1>
                <p>You are not authorized to view this page. Please log in.</p>
                <button onClick={() => navigate('/adminlogin')}>Login</button>
            </div>
        );
    }

    const filteredCities = cities.filter((city) =>
        city.city_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="container-fluid loading-container">Loading...</div>
        );
    }

    return (
        <>
            <div className="city-container">
                <Navbar handleSectionChange={handleSectionChange} />
                <br />
                <br />
                <div className="add-city">
                    <input
                        type="text"
                        placeholder="Add new city"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                    />
                    <button onClick={handleAddCity}>Add City</button>
                </div>
                <h1>Cities</h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
                <table className="city-table">
                    <thead>
                        <tr>
                            <th>City Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCities.map((city, index) => (
                            <tr key={index}>
                                <td>{city.city_name}</td>
                                <td>
                                    <button onClick={() => handleDeleteCity(city.city_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showModal && (
                <ConfirmationModal
                    message="Are you sure you want to delete this bus?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
            </div>
        </>
    );
}
