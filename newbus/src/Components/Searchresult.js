import React, { useEffect, useState } from 'react';
import '../CSS/Searchresult.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import cities from './cities'; // Make sure this is the same list used in Main

export default function Searchresult() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [busDetails, setBusDetails] = useState([]);
    const [fromInput, setFromInput] = useState(searchParams.get('from') || '');
    const [toInput, setToInput] = useState(searchParams.get('to') || '');
    const [dateInput, setDateInput] = useState(searchParams.get('dates') || '');
    const [fromFiltered, setFromFiltered] = useState([]);
    const [toFiltered, setToFiltered] = useState([]);
    const [fromFocus, setFromFocus] = useState(false);
    const [toFocus, setToFocus] = useState(false);

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

            if (data.length === 0) {
                setBusDetails([]);
            } else {
                setBusDetails(data);
            }
        } catch (err) {
            console.error('Failed to fetch bus details:', err);
            setBusDetails([]);
        }
    };

    useEffect(() => {
        fetchBusDetails();
    }, [searchParams]);

    const handleFromChange = (e) => {
        const val = e.target.value;
        setFromInput(val);
        if (val.length >= 2) {
            const filters = cities.filter(place => place.toLowerCase().includes(val.toLowerCase()));
            setFromFiltered(filters);
        } else {
            setFromFiltered([]);
        }
    };
    const handleviewseat = (busno, departure, arrival, fare, travel_id) => {
        navigate(`/viewseat?from=${searchParams.get('from')}&to=${searchParams.get('to')}&date=${searchParams.get('dates')}&bus_number=${busno}&departure=${departure}&arrival=${arrival}&fare=${fare}&travel_id=${travel_id}`);
    };
    const handleToChange = (e) => {
        const val = e.target.value;
        setToInput(val);
        if (val.length >= 2) {
            const filters = cities.filter(place => place.toLowerCase().includes(val.toLowerCase()));
            setToFiltered(filters);
        } else {
            setToFiltered([]);
        }
    };

    const handleFromSelect = (place) => {
        setFromInput(place);
        setFromFiltered([]);
    };

    const handleToSelect = (place) => {
        setToInput(place);
        setToFiltered([]);
    };

    const handleModifySearch = (e) => {
        e.preventDefault();
        setSearchParams({ from: fromInput, to: toInput, dates: dateInput });
        navigate(`/search?from=${fromInput}&to=${toInput}&dates=${dateInput}`);
    };

    return (
        <div>
            <Navbar />
            <form className="modify-search-form" onSubmit={handleModifySearch}>
                <h2>Modify Search</h2>
                <div className="input-group">
                    <label htmlFor="from">From:</label>
                    <input
                        id="from"
                        type="text"
                        value={fromInput}
                        onChange={handleFromChange}
                        onFocus={() => setFromFocus(true)}
                        onBlur={() => setFromFocus(false)}
                        placeholder={searchParams.get('from') || ''}
                    />
                    {fromFocus && fromFiltered.length > 0 && (
                        <ul className="dropdown">
                            {fromFiltered.map((place) => (
                                <li
                                    key={place}
                                    onMouseDown={() => handleFromSelect(place)}
                                    className="dropdown-item"
                                >
                                    {place}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="input-group">
                    <label htmlFor="to">To:</label>
                    <input
                        id="to"
                        type="text"
                        value={toInput}
                        onChange={handleToChange}
                        onFocus={() => setToFocus(true)}
                        onBlur={() => setToFocus(false)}
                        placeholder={searchParams.get('to') || ''}
                    />
                    {toFocus && toFiltered.length > 0 && (
                        <ul className="dropdown">
                            {toFiltered.map((place) => (
                                <li
                                    key={place}
                                    onMouseDown={() => handleToSelect(place)}
                                    className="dropdown-item"
                                >
                                    {place}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="input-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        id="date"
                        type="text"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        placeholder={searchParams.get('dates') || ''}
                    />
                </div>
                <button className="modify-search-button" type="submit">Modify Search</button>
            </form>
            <div className="main-container">
                {busDetails.length === 0 ? (
                    <div className="no-results">
                        <p>No bus found for your search criteria.</p>
                       
                            <button className="btnb" onClick={() => navigate('/')}>Go back to Home Page</button>
                    
                    </div>
                ) : (
                    <>
                        <h1 className="header">Showing results from {searchParams.get('from')} - {searchParams.get('to')}</h1>
                        <br />
                        <br />
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
                                    <br />
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
                                    <p>{item.seatsAvailable} seat available</p>
                                </div>
                                <div className="btn">
                                    <button className="view-seat" onClick={() => handleviewseat(item.bus_number, item.departure, item.arrival, item.fare, item.travel_id)}>View Seats</button>
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
