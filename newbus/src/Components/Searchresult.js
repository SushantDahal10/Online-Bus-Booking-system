import React, { useEffect, useState } from 'react';
import '../CSS/Searchresult.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { RiArrowLeftRightLine } from "react-icons/ri";

export default function Searchresult() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [busDetails, setBusDetails] = useState([]);
    const [fromCity, setFromCity] = useState(searchParams.get('from') || '');
    const [toCity, setToCity] = useState(searchParams.get('to') || '');
    const [date, setDate] = useState(searchParams.get('dates') || '');
    const [fromFiltered, setFromFiltered] = useState([]);
    const [toFiltered, setToFiltered] = useState([]);
    const [fromFocus, setFromFocus] = useState(false);
    const [toFocus, setToFocus] = useState(false);
    const [showModify, setShowModify] = useState(false);
    const [isDateBackDisabled, setIsDateBackDisabled] = useState(false);
    const [cities, setCities] = useState([]);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchCities();
        fetchBusDetails();
        checkDateBackDisabled();
    }, [searchParams, date]);
    const handleViewSeat = (busno, departure, arrival, fare, travel_id,capacity) => {
        navigate(`/viewseat?from=${searchParams.get('from')}&to=${searchParams.get('to')}&date=${searchParams.get('dates')}&bus_number=${busno}&departure=${departure}&arrival=${arrival}&fare=${fare}&travel_id=${travel_id}&capacity=${capacity}`);
    };
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

    const fetchBusDetails = async () => {
        try {
            const from = searchParams.get('from');
            const to = searchParams.get('to');
            const date = searchParams.get('dates');

            if (!from || !to || !date) {
                setBusDetails([]);
                return;
            }

            const res = await fetch(`http://localhost:8000/alltravel?from=${from}&to=${to}&date=${date}`);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            setBusDetails(data.length ? data : []);
        } catch (err) {
            console.error('Failed to fetch bus details:', err);
            setBusDetails([]);
        }
    };

    const checkDateBackDisabled = () => {
        setIsDateBackDisabled(new Date(date) <= new Date(today));
    };

    const handleFromCityChange = (e) => {
        const value = e.target.value;
        setFromCity(value);
        if (value.length >= 2) {
            const filters = cities.filter((place) => place.city_name.toLowerCase().includes(value.toLowerCase()));
            setFromFiltered(filters);
        } else {
            setFromFiltered([]);
        }
    };

    const handleToCityChange = (e) => {
        const value = e.target.value;
        setToCity(value);
        if (value.length >= 2) {
            const filters = cities.filter((place) => place.city_name.toLowerCase().includes(value.toLowerCase()));
            setToFiltered(filters);
        } else {
            setToFiltered([]);
        }
    };

    const handleFromCitySelect = (city) => {
        setFromCity(city);
        setFromFiltered([]);
    };

    const handleToCitySelect = (city) => {
        setToCity(city);
        setToFiltered([]);
    };

    const swapCities = () => {
        setFromCity(toCity);
        setToCity(fromCity);
    };

    const handleModifySearch = (e) => {
        e.preventDefault();
        setShowModify(false)
        setSearchParams({ from: fromCity, to: toCity, dates: date });
        navigate(`/search?from=${fromCity}&to=${toCity}&dates=${date}`);
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setSearchParams({ from: fromCity, to: toCity, dates: newDate });
        navigate(`/search?from=${fromCity}&to=${toCity}&dates=${newDate}`);
        checkDateBackDisabled();
    };

    const handleDateBack = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
        if (newDate.toISOString().split('T')[0] >= today) {
            handleDateChange(newDate.toISOString().split('T')[0]);
        }
    };

    const handleDateForward = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        handleDateChange(newDate.toISOString().split('T')[0]);
    };

    return (
        <div>
            <Navbar />
            {!showModify && (
                <div className="search-criteria">
                    <span>{fromCity} ➔ {toCity}</span>
                    <div className="date-navigation">
                        <button type="button" onClick={handleDateBack} disabled={isDateBackDisabled}>←</button>
                        <span>{new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                        <button type="button" onClick={handleDateForward}>→</button>
                    </div>
                    <button className="modify-button" onClick={() => setShowModify(!showModify)}>Modify</button>
                </div>
            )}
            {showModify && (
                <div className="modify-search-container">
                    <form className="modify-search-form" onSubmit={handleModifySearch}>
                        <h2>Modify Search</h2>
                        <button className="close-button" type="button" onClick={() => setShowModify(false)}>X</button>
                        <div className="input-group">
                            <input
                                id="from"
                                type="text"
                                value={fromCity}
                                onChange={handleFromCityChange}
                                onFocus={() => setFromFocus(true)}
                                onBlur={() => setFromFocus(false)}
                                placeholder={searchParams.get('from') || ''}
                            />
                            {fromFocus && fromFiltered.length > 0 && (
                                <ul className="dropdown">
                                    {fromFiltered.map((place) => (
                                        <li
                                            key={place.city_name}
                                            onMouseDown={() => handleFromCitySelect(place.city_name)}
                                            className="dropdown-item"
                                        >
                                            {place.city_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <span className="arrow" onClick={swapCities}><RiArrowLeftRightLine /></span>
                        <div className="input-group">
                            <input
                                id="to"
                                type="text"
                                value={toCity}
                                onChange={handleToCityChange}
                                onFocus={() => setToFocus(true)}
                                onBlur={() => setToFocus(false)}
                                placeholder={searchParams.get('to') || ''}
                            />
                            {toFocus && toFiltered.length > 0 && (
                                <ul className="dropdown">
                                    {toFiltered.map((place) => (
                                        <li
                                            key={place.city_name}
                                            onMouseDown={() => handleToCitySelect(place.city_name)}
                                            className="dropdown-item"
                                        >
                                            {place.city_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <span className="dateschange">Date: </span>
                        <div className="input-group">
                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => handleDateChange(e.target.value)}
                                placeholder={searchParams.get('dates') || ''}
                                min={today}
                                onClick={(e) => e.target.showPicker()}
                            />
                        </div>
                        <button className="modify-search-button" type="submit">Modify Search</button>
                    </form>
                </div>
            )}
            <div className="main-container">
                {busDetails.length === 0 ? (
                    <div className="no-results">
                        <p>No bus found for your search criteria.</p>
                        <button className="btnb" onClick={() => navigate('/')}>Go back to Home Page</button>
                    </div>
                ) : (
                    <>
                        <h1 className="header">Showing results from {searchParams.get('from')} - {searchParams.get('to')}</h1>
                        <div className="data-of-bus">
                            <div></div>
                            <div>Departure</div>
                            <div>Duration</div>
                            <div>Arrival</div>
                            <div>Fare</div>
                            <div>Seats Available</div>
                        </div>
                        {busDetails.map((item, index) => (
                            <div className="bus-details" key={index}>
                                <div>
                                    <p className="bus-name">{item.bus_name}</p>
                                    <p>Seater (2+2)</p>
                                </div>
                                <div>
                                    <p className="departure">{item.departure}</p>
                                    <p>Bus stand</p>
                                </div>
                                <div className="duration">{item.duration}</div>
                                <div>
                                    <p className="arrival">{item.arrival}</p>
                                    <p>Bus stand</p>
                                </div>
                                <div>
                                    <p>RS <span className="fare">{item.fare}</span></p>
                                </div>
                                <div>
                                    <p>{item.seats_available} Out of {item.capacity}</p>
                                </div>
                                <div className="btn">
                                    <button className="view-seat" onClick={() => handleViewSeat(item.bus_number, item.departure, item.arrival, item.fare, item.travel_id,item.capacity)}>View Seats</button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}
