import React, { useState, useRef, useEffect } from 'react';
import '../CSS/Aftersearch.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import cities from './cities';

export default function Aftersearch() {
    const navigate = useNavigate();
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [date, setDate] = useState('');
    const [filteredFrom, setFilteredFrom] = useState([]);
    const [filteredTo, setFilteredTo] = useState([]);
    const [focusFrom, setFocusFrom] = useState(false);
    const [focusTo, setFocusTo] = useState(false);

    const fromRef = useRef();
    const toRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fromRef.current && !fromRef.current.contains(event.target)) {
                setFocusFrom(false);
            }
            if (toRef.current && !toRef.current.contains(event.target)) {
                setFocusTo(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFocusFrom = () => setFocusFrom(true);
    const handleFocusTo = () => setFocusTo(true);

    const handleChangeFrom = (e) => {
        let val = e.target.value;
        setFromCity(val);
        if (val.length >= 2) {
            let filters = cities.filter((place) => place.toLowerCase().includes(val.toLowerCase()));
            setFilteredFrom(filters);
        } else {
            setFilteredFrom([]);
        }
    }

    const handleChangeTo = (e) => {
        let val = e.target.value;
        setToCity(val);
        if (val.length >= 2) {
            let filters = cities.filter((place) => place.toLowerCase().includes(val.toLowerCase()));
            setFilteredTo(filters);
        } else {
            setFilteredTo([]);
        }
    }

    const handleSelectFrom = (place) => {
        setFromCity(place);
        setFilteredFrom([]);
    }

    const handleSelectTo = (place) => {
        setToCity(place);
        setFilteredTo([]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let selectedDate = document.getElementById('date').value;
        setDate(selectedDate);
        navigate(`/search?from=${fromCity}&to=${toCity}&date=${selectedDate}`);
    }

    return (
        <>
            <Navbar />
            <div className='custom-main'>
                <div className='custom-inside-box-wrapper'>
                    <form onSubmit={handleSubmit} className='custom-inside-box'>
                        <div className='custom-input-group' ref={fromRef}>
                            <input
                                type="text"
                                className='custom-search-input'
                                placeholder='From'
                                value={fromCity}
                                onChange={handleChangeFrom}
                                onFocus={handleFocusFrom}
                            />
                            {focusFrom && filteredFrom.length > 0 && (
                                <ul className="custom-dropdown">
                                    {filteredFrom.map((place) => (
                                        <li
                                            key={place}
                                            onMouseDown={() => handleSelectFrom(place)}
                                            className='custom-dropdown-item'
                                        >
                                            {place}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className='custom-input-group' ref={toRef}>
                            <input
                                type="text"
                                className='custom-search-input'
                                placeholder='To'
                                value={toCity}
                                onChange={handleChangeTo}
                                onFocus={handleFocusTo}
                            />
                            {focusTo && filteredTo.length > 0 && (
                                <ul className="custom-dropdown">
                                    {filteredTo.map((place) => (
                                        <li
                                            key={place}
                                            onMouseDown={() => handleSelectTo(place)}
                                            className='custom-dropdown-item'
                                        >
                                            {place}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className='custom-input-group'>
                            <input type="text" id='date' className='custom-search-input' placeholder='Date' />
                        </div>
                        <div className='custom-input-group'>
                            <button type='submit' className='custom-search-button'>Modify Search</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
