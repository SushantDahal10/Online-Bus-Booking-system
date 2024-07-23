import React, { useState } from 'react';
import '../CSS/Mains.css';
import { TbUserDown, TbUserUp } from "react-icons/tb";
import { BsCalendar3 } from "react-icons/bs";
import cities from './cities';
import { useNavigate } from 'react-router-dom';

export default function Main() {
    const navigate = useNavigate();
    const [fromcity, setfrom] = useState('');
    const [tocity, settocity] = useState('');
    const [date, setdate] = useState('');
    const [filtered, setfiltered] = useState([]);
    const [filteredd, setfilteredd] = useState([]);
    const [focusfrom, setfocusfrom] = useState(false);
    const [focusto, setfocusto] = useState(false);

    const handlefocusfrom = () => setfocusfrom(true);
    const handlefocusto = () => setfocusto(true);
    const handleblurto = () => setfocusto(false);
    const handleblurfrom = () => setfocusfrom(false);

    const handlechange = (e) => {
        let val = e.target.value;
        setfrom(val);
        if (val.length >= 2) {
            let filters = cities.filter((place) => place.toLowerCase().includes(val.toLowerCase()));
            setfiltered(filters);
        } else {
            setfiltered([]);
        }
    }

    const handlechangeto = (e) => {
        let val = e.target.value;
        settocity(val);
        if (val.length >= 2) {
            let filters = cities.filter((place) => place.toLowerCase().includes(val.toLowerCase()));
            setfilteredd(filters);
        } else {
            setfilteredd([]);
        }
    }

    const handlefromvalue = (place) => {
        setfrom(place);
        setfiltered([]);
    }

    const handlefromto = (places) => {
        settocity(places);
        setfilteredd([]);
    }

    const handlesubmit = (e) => {
        e.preventDefault();
        let dates = document.getElementById('date').value;
        setdate(dates);
        navigate(`/search?from=${fromcity}&to=${tocity}&dates=${dates}`);
    }

    return (
        <div className='main'>
            <div className='form-container'>
                <form onSubmit={handlesubmit} className='form'>
                    <div className='input-group'>
                        <TbUserDown className='icon' />
                        <input
                            type="text"
                            className='input-field'
                            placeholder='From'
                            value={fromcity}
                            onChange={handlechange}
                            onFocus={handlefocusfrom}
                            onBlur={handleblurfrom}
                            required
                        />
                        {focusfrom && filtered.length > 0 && (
                            <ul className="dropdown">
                                {filtered.map((place) => (
                                    <li
                                        key={place}
                                        onMouseDown={() => handlefromvalue(place)}
                                        className='dropdown-item'
                                    >
                                        {place}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className='input-group'>
                        <TbUserUp className='icon' />
                        <input
                            type="text"
                            className='input-field'
                            placeholder='To'
                            value={tocity}
                            onChange={handlechangeto}
                            onFocus={handlefocusto}
                            onBlur={handleblurto}
                            required
                        />
                        {focusto && filteredd.length > 0 && (
                            <ul className="dropdown">
                                {filteredd.map((place) => (
                                    <li
                                        key={place}
                                        onMouseDown={() => handlefromto(place)}
                                        className='dropdown-item'
                                    >
                                        {place}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className='input-group'>
                        <BsCalendar3 className='icon' />
                        <input type="text" id='date' className='input-field' placeholder='Date' required />
                    </div>
                    <button type='submit' className='submit-button'>Search</button>
                </form>
            </div>
        </div>
    );
}
