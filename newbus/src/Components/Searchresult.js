import React, { useEffect, useState } from 'react';
import '../CSS/Searchresult.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Searchresult() {
    const Navigate=useNavigate()
    const params = new URLSearchParams(window.location.search);
    const [busDetails, setBusDetails] = useState([]);
    const navigate = useNavigate();

    const handleviewseat = (busno, departure, arrival, fare, travel_id) => {
        navigate(`/viewseat?from=${params.get('from')}&to=${params.get('to')}&date=${params.get('dates')}&bus_number=${busno}&departure=${departure}&arrival=${arrival}&fare=${fare}&travel_id=${travel_id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/alltravel?from=${params.get('from')}&to=${params.get('to')}&date=${params.get('dates')}`);
                const data = await res.json();
                setBusDetails(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Navbar />
            <div className='main-container'>
               
                {busDetails.length === 0 ? (
                    <div className='no-results'>
                        <p>No bus found for your search criteria.</p>
                        <button className='btnb' onClick={()=>Navigate('/')}>Go back</button>
                    </div>
                ) : (<>
                    <h1 className='header'>Showing results from {params.get('from')} - {params.get('to')}</h1>
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
                                    <p className='bus-name'>{item.bus_name}</p>
                                    <br />
                                    <p>Seater (2+2)</p>
                                </div>
                                <div>
                                    <p className='departure'>{item.departure}</p>
                                    <p>Bus stand</p>
                                </div>
                                <div className='duration'>{item.duration}</div>
                                <div>
                                    <p className='arrival'>{item.arrival}</p>
                                    <p>Bus stand</p>
                                </div>
                                <div>
                                    <p>RS <span className='fare'>{item.fare}</span></p>
                                </div>
                                <div>
                                    <p>{item.seatsAvailable} seat available</p>
                                </div>
                                <div className='btn'>
                                    <button className='view-seat' onClick={() => handleviewseat(item.bus_number, item.departure, item.arrival, item.fare, item.travel_id)}>View Seats</button>
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
