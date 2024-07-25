import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { PiSteeringWheelDuotone, PiSeat } from 'react-icons/pi';
import './Admincss/Adminseats.css'

export default function Adminseats() {
  const [occupied, setOccupied] = useState([]);
  const [loading, setLoading] = useState(true); 
  const params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

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
  }, []);

  const handleBack = () => {
    navigate('/admin/travel');
  };

  const isOccupied = (seatId) => occupied.includes(seatId);

  if (loading) {
    return (
      <div className="admin-loading-container">Loading...</div>
    );
  }

  return (
    <div>
      <div className="admin-container">
        <div className="admin-busseat">
          <div className="admin-driver">
            <PiSteeringWheelDuotone className='admin-sterring' />
          </div>
          <div className="admin-customerseats">
            <div className="admin-leftseat">
              {Array.from({ length: 10 }).map((_, index) => (
                <div className='admin-onecol' key={index}>
                  <div className="admin-window">
                    <PiSeat
                      className={`admin-pi-seat ${isOccupied(`L${index * 2 + 1}`) ? 'admin-occupied-seat' : 'admin-unselected-seat'}`}
                    />
                  </div>
                  <div className="admin-non-window">
                    <PiSeat
                      className={`admin-pi-seat ${isOccupied(`L${index * 2 + 2}`) ? 'admin-occupied-seat' : 'admin-unselected-seat'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-rightseat">
              {Array.from({ length: 10 }).map((_, index) => (
                <div className='admin-onecol' key={index}>
                  <div className="admin-window">
                    <PiSeat
                      className={`admin-pi-seat ${isOccupied(`R${index * 2 + 1}`) ? 'admin-occupied-seat' : 'admin-unselected-seat'}`}
                    />
                  </div>
                  <div className="admin-non-window">
                    <PiSeat
                      className={`admin-pi-seat ${isOccupied(`R${index * 2 + 2}`) ? 'admin-occupied-seat' : 'admin-unselected-seat'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="admin-availableindex">
            <div className="admin-available">
              <p className="admin-avab">Available</p>
            </div>
            <div className="admin-occupied">
              <p className="admin-avab">Occupied</p>
            </div>
          </div>
        </div>
        <button onClick={handleBack} className="admin-back">
          <div className="admin-backbtn">
            <IoArrowBackOutline />
          </div>
          <div className="admin-backval">
            Go back
          </div>
        </button>
      </div>
    </div>
  );
}
