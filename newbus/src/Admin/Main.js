import React, { useState } from 'react';
import Navbar from './Navbar';
import './Admincss/Main.css';

export default function Main() {
  const [bus, setBus] = useState(false);
  const [travel, setTravel] = useState(false);
  const [formdatabus, setformdatabus] = useState({});
  const [formdatetravel, setformdatetravel] = useState({});

  const handleBus = () => {
    setBus(true);
    setTravel(false);
  };

  const handleTravel = () => {
    setTravel(true);
    setBus(false);
  };

  const handleBusSubmit = async (e) => {
    e.preventDefault();
    let busno = document.getElementById('busno').value;
    let busname = document.getElementById('busname').value;
    let buscontact = document.getElementById('buscontact').value;
    let capacity = document.getElementById('buscapacity').value;
    let obj = {
      bus_number: busno,
      bus_name: busname,
      contactno: buscontact,
      capacity: capacity
    };
    await setformdatabus(obj);
    console.log(obj);

    try {
      const res = await fetch('http://localhost:8000/admin/bus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      });

      if (!res.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await res.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
    window.location.reload();
    setBus(true);
    
  };

  const handleTravelSubmit = async (e) => {
    e.preventDefault();
    let source = document.getElementById('source').value;
    let destination = document.getElementById('destination').value;
    let fare = document.getElementById('fare').value;
    let duration = document.getElementById('duration').value;
    let departure = document.getElementById('departure').value;
    let arrival = document.getElementById('arrival').value;
    let dateOfTravel = document.getElementById('date-of-travel').value;
    let bus_number = document.getElementById('bus_number').value;

    let obj = {
      source: source,
      destination: destination,
      fare: fare,
      duration: duration,
      departure: departure,
      arrival: arrival,

      date_of_travel: dateOfTravel,
      bus_number:bus_number  
    };

    await setformdatetravel(obj);
    console.log(obj);

    try {
      const res = await fetch('http://localhost:8000/admin/travel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      });

      if (!res.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await res.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
    window.location.reload();
  
  };

  return (
    <div>
      <div className="nav">
        <Navbar />
      </div>
      <div className="m">
        <div className="side">
          <div className="mm">
            <div className="bus" onClick={handleBus}>
              Bus Details
            </div>
            <div className="travel" onClick={handleTravel}>
              Travel Details
            </div>
          </div>
        </div>
        <div>
          {bus && (
            <div className="sideone">
              <form className="inputfields" onSubmit={handleBusSubmit}>
                <div>
                  <input
                    type="text"
                    id="busno"
                    name="busno"
                    placeholder="Enter Bus Number"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="busname"
                    name="busname"
                    placeholder="Enter Bus Name"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="buscontact"
                    name="buscontact"
                    placeholder="Enter Contact No."
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="buscapacity"
                    name="capacity"
                    placeholder="Enter Capacity"
                    required
                  />
                </div>
                <div className="save-button-container">
                  <button type="submit" className="save-button">
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
          {travel && (
            <div className="sideonet">
              <form className="inputfieldst" onSubmit={handleTravelSubmit}>
                <div>
                  <input
                    type="text"
                    id="source"
                    placeholder="Enter Source"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="destination"
                    placeholder="Enter Destination"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="fare"
                    placeholder="Enter Fare"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="duration"
                    placeholder="Enter Duration"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="departure"
                    placeholder="Enter Departure"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="arrival"
                    placeholder="Enter Arrival"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="date-of-travel"
                    placeholder="Enter Date of Travel"
                    required
                  />
                </div>
              
                <div>
                  <input
                    type="text"
                    id="bus_number"
                    placeholder="Enter Bus number"
                    required
                  />
                </div>
                <div className="save-button-container">
                  <button type="submit" className="save-button">
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
