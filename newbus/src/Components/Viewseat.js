import React, { useState, useEffect } from 'react';
import '../CSS/Viewseat.css';
import { PiSteeringWheelDuotone, PiSeat } from 'react-icons/pi';
import Payement from './Payement';
import Navbar from './Navbar';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Addseat } from '../redux/busprice';
import Footer from './Footer';

export default function Viewseat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = new URLSearchParams(window.location.search);
  const [occupied, setOccupied] = useState([]);
  const [loading, setLoading] = useState(true); 
  const selectedSeats = useSelector(state => state.busprice.selectedSeats);

  const detaiofpayment = {
    from: params.get('from') || '',  
    to: params.get('to') || '',
    date: params.get('date') || '',
    bus_number: params.get('bus_number') || '',
    departure: params.get('departure') || '',
    arrival: params.get('arrival') || '',
    fare: params.get('fare') || '',
    travel_id: params.get('travel_id') || '',
    date_of_travel: params.get('date') || ''
  };

  const handleBack = () => {
    navigate(`/search?from=${params.get('from')}&to=${params.get('to')}&dates=${params.get('date')}`);
  };

  useEffect(() => {
    const fetchPassenger = async () => {
      const obj = {
        travel_id: params.get('travel_id'),
      };

      try {
        const response = await fetch('http://localhost:8000/bookingstatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj)
        });

        if (response.ok) {
          const data = await response.json();
          const occupiedSeats = data.result.map(booking => booking.seat_no);
          setOccupied(occupiedSeats);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false); 
      }
    };

    fetchPassenger();
  }, [params]);

  const handleSeatClick = (seatId) => {
    if (!occupied.includes(seatId)) {
      if (selectedSeats.length >= 8 && !selectedSeats.includes(seatId)) {
        alert('You can select only 8 seats');
      } else {
        dispatch(Addseat(seatId));
      }
    } else {
      alert('Seat already booked');
    }
  };

  const isSelected = (seatId) => selectedSeats.includes(seatId);
  const isOccupied = (seatId) => occupied.includes(seatId);

  if (loading) {
    return (
      <div className="container-fluid loading-container">Loading...</div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="contain">
        <div className="busseat">
          <div className="driver">
            <PiSteeringWheelDuotone className='sterring' />
          </div>
          <div className="customerseats">
            <div className="leftseat">
              {Array.from({ length: 10 }).map((_, index) => (
                <div className='onecol' key={index}>
                  <div className="window">
                    <PiSeat
                      className={`pi-seat ${isOccupied(`L${index * 2 + 1}`) ? 'occupied-seat' : isSelected(`L${index * 2 + 1}`) ? 'selected-seat' : 'unselected-seat'}`}
                      onClick={() => handleSeatClick(`L${index * 2 + 1}`)}
                    />
                  </div>
                  <div className="non-window">
                    <PiSeat
                      className={`pi-seat ${isOccupied(`L${index * 2 + 2}`) ? 'occupied-seat' : isSelected(`L${index * 2 + 2}`) ? 'selected-seat' : 'unselected-seat'}`}
                      onClick={() => handleSeatClick(`L${index * 2 + 2}`)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="rightseat">
              {Array.from({ length: 10 }).map((_, index) => (
                <div className='onecol' key={index}>
                  <div className="window">
                    <PiSeat
                      className={`pi-seat ${isOccupied(`R${index * 2 + 1}`) ? 'occupied-seat' : isSelected(`R${index * 2 + 1}`) ? 'selected-seat' : 'unselected-seat'}`}
                      onClick={() => handleSeatClick(`R${index * 2 + 1}`)}
                    />
                  </div>
                  <div className="non-window">
                    <PiSeat
                      className={`pi-seat ${isOccupied(`R${index * 2 + 2}`) ? 'occupied-seat' : isSelected(`R${index * 2 + 2}`) ? 'selected-seat' : 'unselected-seat'}`}
                      onClick={() => handleSeatClick(`R${index * 2 + 2}`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="availableindex">
            <div className="available">
              <p className="avab">Available</p>
            </div>
            <div className="occupied">
              <p className="avab">Occupied</p>
            </div>
          </div>
        </div>
        {selectedSeats.length > 0 && (
          <div className='pricebox'>
            <Payement paymentdetail={detaiofpayment} />
          </div>
        )}
        <button onClick={handleBack} className="back">
          <div className="backbtn">
            <IoArrowBackOutline />
          </div>
          <div className="backval">
            Go back/view other Buses
          </div>
        </button>
      </div>
      <Footer />
    </div>  
  );
} 