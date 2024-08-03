import React, { useState, useEffect } from 'react';
import '../CSS/Mains.css';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftRightLine } from "react-icons/ri";

export default function Main() {
    const navigate = useNavigate();
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [date, setDate] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [filteredTo, setFilteredTo] = useState([]);
    const [focusFrom, setFocusFrom] = useState(false);
    const [focusTo, setFocusTo] = useState(false);
    const [cities, setCities] = useState([]);

    const handleFocusFrom = () => setFocusFrom(true);
    const handleFocusTo = () => setFocusTo(true);
    const handleBlurFrom = () => setFocusFrom(false);
    const handleBlurTo = () => setFocusTo(false);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const res = await fetch('http://localhost:8000/cities');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCities(data);
            } else {
                console.error('Fetched cities is not an array:', data);
            }
        } catch (err) {
            console.error('Error fetching cities details:', err);
        }
    };

    const handleFromChange = (e) => {
        let val = e.target.value;
        setFromCity(val);
        if (val.length >= 2) {
            let filters = cities.filter((place) => place.city_name.toLowerCase().includes(val.toLowerCase()));
            setFiltered(filters);
        } else {
            setFiltered([]);
        }
    };

    const handleToChange = (e) => {
        let val = e.target.value;
        setToCity(val);
        if (val.length >= 2) {
            let filters = cities.filter((place) => place.city_name.toLowerCase().includes(val.toLowerCase()));
            setFilteredTo(filters);
        } else {
            setFilteredTo([]);
        }
    };

    const handleFromSelect = (place) => {
        setFromCity(place);
        setFiltered([]);
    };

    const handleToSelect = (place) => {
        setToCity(place);
        setFilteredTo([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?from=${fromCity}&to=${toCity}&dates=${date}`);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const swapCities = () => {
        setFromCity(toCity);
        setToCity(fromCity);
    };

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const setDateToday = () => setDate(today);
    const setDateTomorrow = () => setDate(tomorrow);

    return (
        <div className='main'>
            <div className='form-container'>
                <form onSubmit={handleSubmit} className='form'>
                    <div className='input-group'>
                        <input
                            type="text"
                            className='input-field'
                            placeholder='From'
                            value={fromCity}
                            onChange={handleFromChange}
                            onFocus={handleFocusFrom}
                            onBlur={handleBlurFrom}
                            id='suggestions'
                            required
                        />
                        {focusFrom && filtered.length > 0 && (
                            <ul className="dropdown">
                                {filtered.map((place) => (
                                    <li
                                        key={place.city_name}
                                        onMouseDown={() => handleFromSelect(place.city_name)}
                                        className='dropdown-item'
                                    >
                                        {place.city_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <RiArrowLeftRightLine className='swap' onClick={swapCities} />
                    <div className='input-group'>
                        <input
                            type="text"
                            className='input-field'
                            placeholder='To'
                            value={toCity}
                            onChange={handleToChange}
                            onFocus={handleFocusTo}
                            onBlur={handleBlurTo}
                            required
                        />
                        {focusTo && filteredTo.length > 0 && (
                            <ul className="dropdown">
                                {filteredTo.map((place) => (
                                    <li
                                        key={place.city_name}
                                        onMouseDown={() => handleToSelect(place.city_name)}
                                        className='dropdown-item'
                                    >
                                        {place.city_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className='input-group date-group'>
                        <input
                            type="date"
                            id='date'
                            className='input-field date-input'
                            placeholder='Date'
                            value={date}
                            onChange={handleDateChange}
                            min={today}
                            onClick={(e) => e.target.showPicker()}
                            required
                        />
                        <div className='date-buttons'>
                            <button type="button" className='date-button' onClick={setDateToday}>Today</button>
                            <button type="button" className='date-button' onClick={setDateTomorrow}>Tomorrow</button>
                        </div>
                    </div>
                    <button type='submit' className='submit-button'>Search</button>
                </form>
            </div>
        </div>
    );
}
