import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Main from './Main';
export default function Travel() {
  const [travelDetails, setTravelDetails] = useState([]);
  const [editingTravelId, setEditingTravelId] = useState(null);
  const [filteredBusNumbers, setFilteredBusNumbers] = useState([]);
  const [busDetails, setBusDetails] = useState([]);
  const [focusBusNumber, setFocusBusNumber] = useState(false);
  const [filteredSource, setFilteredSource] = useState([]);
  const [filteredDestination, setFilteredDestination] = useState([]);
  const [focusSource, setFocusSource] = useState(false);
  const [focusDestination, setFocusDestination] = useState(false);
  const [adds, setAdds] = useState(true);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); 
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    fare: '',
    duration: '',
    departure: '',
    arrival: '',
    date_of_travel: '',
    bus_number: ''
  });
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
};
  const [unauthorized, setUnauthorized] = useState(false);
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  useEffect(() => {
    fetchTravelDetails();
    fetchBusDetails();
    fetchCities();
  }, []);
  const  handleviewseat=(travel_id)=>{
    navigate(`/admin/seats?travel_id=${travel_id}`)
  }
  const fetchCities = async () => {
    try {
      const res = await fetch('http://localhost:8000/cities', {
        credentials: 'include'
      });

      if (res.status === 401) {
        setUnauthorized(true);
        return;
      }

      const data = await res.json();

      setCities(data);  
      console.log(cities);
    } catch (err) {
      console.error('Error fetching cities details:', err);
    }
    finally{
      setLoading(false)
    }
  };

  const fetchBusDetails = async () => {
    try {
      const res = await fetch('http://localhost:8000/busdetail', {
        credentials: 'include'
      });

      if (res.status === 401) {
        setUnauthorized(true);
        return;
      }

      const data = await res.json();
      setBusDetails(data.result);
    } catch (err) {
      console.error('Error fetching bus details:', err);
    }
    finally{
      setLoading(false)
    }
  };

  const fetchTravelDetails = async () => {
    try {
      const res = await fetch('http://localhost:8000/traveldetail', {
        credentials: 'include'
      });

      if (res.status === 401) {
        setUnauthorized(true);
        return;
      }

      const data = await res.json();
      const sortedtravel = data.result.sort((a, b) => new Date(a.date_of_travel) - new Date(b.date_of_travel));
      setTravelDetails(sortedtravel);
    } catch (err) {
      console.error('Error fetching travel details:', err);
    }
    finally{
      setLoading(false)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'source' && value.length >= 2) {
      const filtered = cities.filter(city => city.city_name.toLowerCase().includes(value.toLowerCase()));
      setFilteredSource(filtered);
    } else if (name === 'source') {
      setFilteredSource([]);
    }

    if (name === 'destination' && value.length >= 2) {
      const filtered = cities.filter(city => city.city_name.toLowerCase().includes(value.toLowerCase()));
      setFilteredDestination(filtered);
    } else if (name === 'destination') {
      setFilteredDestination([]);
    }

    if (name === 'bus_number' && value.length >= 0) {
      const filtered = busDetails.filter(bus => bus.bus_number.toLowerCase().includes(value.toLowerCase()));
      setFilteredBusNumbers(filtered);
    } else if (name === 'bus_number') {
      setFilteredBusNumbers([]);
    }
  };  

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/getbusid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bus_number: formData.bus_number }),
        credentials: 'include'
      });

      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const bus_id = data.result.bus_id;
        const travelData = { ...formData, bus_id };

        await fetch('http://localhost:8000/admin/travel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(travelData),
          credentials: 'include'
        });

        fetchTravelDetails();
        setFormData({
          source: '',
          destination: '',
          fare: '',
          duration: '',
          departure: '',
          arrival: '',
          date_of_travel: '',
          bus_number: ''
        });
        alert('Travel Added Successfully');
      } else {
        alert('Bus not found');
      }
    } catch (err) {
      console.error('Error adding travel detail:', err);
    }
  };

  const handleCancel = () => {
    setAdds(true);
    setEditingTravelId(null);
  };

  const handleUpdate = async (travel_id) => {
    try {
      const response = await fetch('http://localhost:8000/getbusid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bus_number: formData.bus_number }),
        credentials: 'include'
      });

      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const bus_id = data.result.bus_id;
        const travelData = { ...formData, bus_id };

        const updateResponse = await fetch(`http://localhost:8000/travelupdate?travel_id=${travel_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(travelData),
          credentials: 'include'
        });

        if (updateResponse.status === 401) {
          setUnauthorized(true);
          return;
        }

        if (updateResponse.ok) {
          alert('Travel Updated Successfully');
        }

        setEditingTravelId(null);
        fetchTravelDetails();
        setFormData({
          source: '',
          destination: '',
          fare: '',
          duration: '',
          departure: '',
          arrival: '',
          date_of_travel: '',
          bus_number: ''
        });
      } else {
        alert('Bus not found');
      }
    } catch (err) {
      console.error('Error updating travel detail:', err);
    }
  };

  const handleEdit = (travel) => {
    setFormData(travel);
    setEditingTravelId(travel.travel_id);
    setAdds(false);
  };

  const handleDelete = async (travel_id) => {
    try {
      const response = await fetch(`http://localhost:8000/deletetravel?travel_id=${travel_id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }

      if (response.ok) {
        alert('Travel Deleted Successfully');
      }
      fetchTravelDetails();
    } catch (err) {
      console.error('Error deleting travel detail:', err);
    }
  };
  const filteredtraveldetail = travelDetails.filter((travels) =>
    Object.values(travels).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
);

  if (unauthorized) {
    return (
      <div className="unauthorized-container">  
        <h1>Unauthorized</h1>
        <p>You are not authorized to view this page. Please log in.</p>
        <button onClick={() => navigate('/adminlogin')}>Login</button>
      </div>
    );
  }
  if (loading) {
    return (
<div className="container-fluid loading-container">Loading...</div>
);
}
  const handleSectionChange = (newSection) => {
    navigate(`/admin/${newSection}`);
  };
  return (
    <div className="travel-detail-container">
       <Navbar handleSectionChange={handleSectionChange} />
      <h1>Travel Details</h1>
      {adds && (
        <form onSubmit={handleAdd}>
  <div className="input-group">
    <label htmlFor="source">Source<span>:</span></label>
    <input
      type="text"
      id="source"
      name="source"
      placeholder="Source"
      value={formData.source}
      onChange={handleChange}
      onFocus={() => setFocusSource(true)}
      onBlur={() => setFocusSource(false)}
      required
    />
    {focusSource && filteredSource.length > 0 && (
      <ul className="dropdown">
        {filteredSource.map((place) => (
          <li
            key={place.city_name}
            onMouseDown={() => {
              setFormData({ ...formData, source: place.city_name });
              setFilteredSource([]);
            }}
            className="dropdown-item"
          >
            {place.city_name}
          </li>
        ))}
      </ul>
    )}
  </div>

  <div className="input-group">
    <label htmlFor="destination">Destination<span>:</span></label>
    <input
      type="text"
      id="destination"
      name="destination"
      placeholder="Destination"
      value={formData.destination}
      onChange={handleChange}
      onFocus={() => setFocusDestination(true)}
      onBlur={() => setFocusDestination(false)}
      required
    />
    {focusDestination && filteredDestination.length > 0 && (
      <ul className="dropdown">
        {filteredDestination.map((place) => (
          <li
            key={place.city_name}
            onMouseDown={() => {
              setFormData({ ...formData, destination: place.city_name });
              setFilteredDestination([]);
            }}
            className="dropdown-item"
          >
            {place.city_name}
          </li>
        ))}
      </ul>
    )}
  </div>

  <div className="input-group">
    <label htmlFor="fare">Fare<span>:</span></label>
    <input
      type="text"
      id="fare"
      name="fare"
      placeholder="Fare"
      value={formData.fare}
      onChange={handleChange}
      required
    />
  </div>

  <div className="input-group">
    <label htmlFor="duration">Duration<span>:</span></label>
    <input
      type="text"
      id="duration"
      name="duration"
      placeholder="Duration"
      value={formData.duration}
      onChange={handleChange}
      required
    />
  </div>

  <div className="input-group">
    <label htmlFor="departure">Departure<span>:</span></label>
    <input
      type="time"
      id="departure"
      name="departure"
      placeholder="Departure"
      value={formData.departure}
      onChange={handleChange}
      onClick={(e) => e.target.showPicker()}
      required
    />
  </div>

  <div className="input-group">
    <label htmlFor="arrival">Arrival<span>: </span></label>
    <input
      type="time"
      id="arrival"
      name="arrival"
      placeholder="Arrival"
      value={formData.arrival}
      onChange={handleChange}
      onClick={(e) => e.target.showPicker()}
      required
    />
  </div>

  <div className="input-group">
    <label htmlFor="date_of_travel">Date of Travel:</label>
    <input
      type="date"
      id="date_of_travel"
      name="date_of_travel"
      placeholder="Date of Travel"
      value={formData.date_of_travel}
      onChange={handleChange}
      min={today}
      onClick={(e) => e.target.showPicker()}
      required
    />
  </div>

  <div className="input-group">
    <label htmlFor="bus_number">Bus Number:</label>
    <input
      type="text"
      id="bus_number"
      name="bus_number"
      placeholder="Bus Number"
      value={formData.bus_number}
      onChange={handleChange}
      onFocus={() => setFocusBusNumber(true)}
      onBlur={() => setFocusBusNumber(false)}
      required
    />
    {focusBusNumber && filteredBusNumbers.length > 0 && (
      <ul className="dropdown">
        {filteredBusNumbers.map((bus) => (
          <li
            key={bus.bus_number}
            onMouseDown={() => {
              setFormData({ ...formData, bus_number: bus.bus_number });
              setFilteredBusNumbers([]);
            }}
            className="dropdown-item"
          >
            {bus.bus_number}
          </li>
        ))}
      </ul>
    )}
  </div>
  
  <button type="submit">Add</button>
</form>

      )}
      <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Destination</th>
            <th>Fare</th>
            <th>Duration</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Date of Travel</th>
            <th>Bus Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredtraveldetail.map((travel) => (
            <tr key={travel.travel_id}>
              <td>
                {editingTravelId === travel.travel_id ? (
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    onFocus={() => setFocusSource(true)}
                    onBlur={() => setFocusSource(false)}
                  />
                ) : (
                  travel.source
                )}
              </td>
              <td>
                {editingTravelId === travel.travel_id ? (
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    onFocus={() => setFocusDestination(true)}
                    onBlur={() => setFocusDestination(false)}
                  />
                ) : (
                  travel.destination
                )}
              </td>
              <td>
                {editingTravelId === travel.travel_id ? (
                  <input
                    type="text"
                    name="fare"
                    value={formData.fare}
                    onChange={handleChange}
                  />
                ) : (
                  travel.fare
                )}
              </td>
              <td>
                {editingTravelId === travel.travel_id ? (
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                ) : (
                  travel.duration
                )}
              </td>
              <td>
                {editingTravelId === travel.travel_id ? (
                  <input
                    type="time"
                    name="departure"
                    value={formData.departure}
                    onChange={handleChange}
                    onClick={(e) => e.target.showPicker()}
                  />
                ) : (
                  travel.departure
                )}
              </td>
              <td>
                {editingTravelId === travel.travel_id ? (
                  <input
                    type="time"
                    name="arrival"
                    value={formData.arrival}
                    onChange={handleChange}
                    onClick={(e) => e.target.showPicker()}
                  />
                ) : (
                  travel.arrival
                )}
              </td>
              <td>
                {editingTravelId === travel.travel_id ? (
                  <input
                    type="date"
                    name="date_of_travel"
                    value={formData.date_of_travel}
                    onChange={handleChange}
                    min={today}
                    onClick={(e) => e.target.showPicker()}
                  />
                ) : (
                  travel.date_of_travel.split('T')[0]
                )}
              </td>
              <td>
                {editingTravelId === travel.travel_id ? (
                  <div className="input-group">
                    <input
                      type="text"
                      name="bus_number"
                      value={formData.bus_number}
                      onChange={handleChange}
                      onFocus={() => setFocusBusNumber(true)}
                      onBlur={() => setFocusBusNumber(false)}
                    />
                    {focusBusNumber && filteredBusNumbers.length > 0 && (
                      <ul className="dropdown">
                        {filteredBusNumbers.map((bus) => (
                          <li
                            key={bus.bus_number}
                            onMouseDown={() => {
                              setFormData({ ...formData, bus_number: bus.bus_number });
                              setFilteredBusNumbers([]);
                            }}
                            className="dropdown-item"
                          >
                            {bus.bus_number}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  travel.bus_number
                )}
              </td>
              <td>
                {editingTravelId === travel.travel_id ? (
                  <>
                    <button onClick={() => handleUpdate(travel.travel_id)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(travel)}>Edit</button>
                    <button onClick={() => handleDelete(travel.travel_id)}>Delete</button>
                    <button onClick={()=>handleviewseat(travel.travel_id)}>View seats</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
