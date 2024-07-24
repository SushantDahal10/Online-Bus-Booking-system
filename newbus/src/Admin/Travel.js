    import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import './Admincss/Travel.css';

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

    const [unauthorized, setUnauthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      fetchTravelDetails();
      fetchBusDetails();
      fetchCities();
    }, []);

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
        console.log(cities)
      
      } catch (err) {
        console.error('Error fetching cities details:', err);
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
        setTravelDetails(data.result);
      } catch (err) {
        console.error('Error fetching travel details:', err);
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

    if (unauthorized) {
      return (
        <div className="unauthorized-container">
          <h1>Unauthorized</h1>
          <p>You are not authorized to view this page. Please log in.</p>
          <button onClick={() => navigate('/adminlogin')}>Login</button>
        </div>
      );
    }

    return (
      <div className="travel-detail-container">
        <h1>Travel Details</h1>
        {adds && (
          <form onSubmit={handleAdd}>
            <div className="input-group">
              <input
                type="text"
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
              <input
                type="text"
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
              <input
                type="text"
                name="fare"
                placeholder="Fare"
                value={formData.fare}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="departure"
                placeholder="Departure"
                value={formData.departure}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="arrival"
                placeholder="Arrival"
                value={formData.arrival}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="date"
                name="date_of_travel"
                placeholder="Date of Travel"
                value={formData.date_of_travel}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
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
            <button type="submit">Add Travel</button>
          </form>
        )}
        {!adds && (
          <div className="editing-form">
            <form>
              <div className="input-group">
                <input
                  type="text"
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
                        key={place}
                        onMouseDown={() => {
                          setFormData({ ...formData, source: place });
                          setFilteredSource([]);
                        }}
                        className="dropdown-item"
                      >
                        {place}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
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
                        key={place}
                        onMouseDown={() => {
                          setFormData({ ...formData, destination: place });
                          setFilteredDestination([]);
                        }}
                        className="dropdown-item"
                      >
                        {place}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="fare"
                  placeholder="Fare"
                  value={formData.fare}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="departure"
                  placeholder="Departure"
                  value={formData.departure}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="arrival"
                  placeholder="Arrival"
                  value={formData.arrival}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="date"
                  name="date_of_travel"
                  placeholder="Date of Travel"
                  value={formData.date_of_travel}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
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
              <div className="button-group">
                <button type="button" onClick={() => handleUpdate(editingTravelId)}>Update Travel</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )}
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {travelDetails.map((travel) => (
              <tr key={travel.travel_id}>
                <td>{travel.source}</td>
                <td>{travel.destination}</td>
                <td>{travel.fare}</td>
                <td>{travel.duration}</td>
                <td>{travel.departure}</td>
                <td>{travel.arrival}</td>
                <td>{travel.date_of_travel}</td>
                <td>{travel.bus_number}</td>
                <td>
                  <button onClick={() => handleEdit(travel)}>Edit</button>
                  <button onClick={() => handleDelete(travel.travel_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
