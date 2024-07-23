import React, { useState, useEffect } from 'react';
import './Admincss/Travel.css';

export default function Travel() {
  const [travelDetails, setTravelDetails] = useState([]);
  const [editingTravelId, setEditingTravelId] = useState(null);
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

  useEffect(() => {
    fetchTravelDetails();
  }, []);

  const fetchTravelDetails = async () => {
    try {
      const res = await fetch('http://localhost:8000/traveldetail');
      const data = await res.json();
      setTravelDetails(data.result);
    } catch (err) {
      console.error('Error fetching travel details:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
       
        const response = await fetch('http://localhost:8000/getbusid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bus_number: formData.bus_number })
        });

        if (response.ok) {
            const data = await response.json();
            const bus_id = data.result.bus_id;

       
            const travelData = { ...formData, bus_id };

   
            await fetch('http://localhost:8000/admin/travel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(travelData)
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


  const handleUpdate = async (travel_id) => {
    try {
      const response = await fetch(`http://localhost:8000/travelupdate?travel_id=${travel_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
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
    } catch (err) {
      console.error('Error updating travel detail:', err);
    }
  };

  const handleEdit = (travel) => {
    setFormData(travel);
    setEditingTravelId(travel.travel_id);
  };

  const handleDelete = async (travel_id) => {
    try {
      const response = await fetch(`http://localhost:8000/deletetravel?travel_id=${travel_id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Travel Deleted Successfully');
      }
      fetchTravelDetails();
    } catch (err) {
      console.error('Error deleting travel detail:', err);
    }
  };

  return (
    <div className="travel-detail-container">
      <h1>Travel Details</h1>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          name="source"
          placeholder="Source"
          value={formData.source}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fare"
          placeholder="Fare"
          value={formData.fare}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="departure"
          placeholder="Departure"
          value={formData.departure}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="arrival"
          placeholder="Arrival"
          value={formData.arrival}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="date_of_travel"
          placeholder="Date of Travel"
          value={formData.date_of_travel}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="bus_number"
          placeholder="Bus Number"
          value={formData.bus_number}
          onChange={handleChange}
          required
        />
        <button type="submit">Add</button>
      </form>
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
          {travelDetails.map((travel) => (
            <tr key={travel.travel_id}>
              {editingTravelId === travel.travel_id ? (
                <>
                  <td><input type="text" name="source" value={formData.source} onChange={handleChange} /></td>
                  <td><input type="text" name="destination" value={formData.destination} onChange={handleChange} /></td>
                  <td><input type="text" name="fare" value={formData.fare} onChange={handleChange} /></td>
                  <td><input type="text" name="duration" value={formData.duration} onChange={handleChange} /></td>
                  <td><input type="text" name="departure" value={formData.departure} onChange={handleChange} /></td>
                  <td><input type="text" name="arrival" value={formData.arrival} onChange={handleChange} /></td>
                  <td><input type="text" name="date_of_travel" value={formData.date_of_travel} onChange={handleChange} /></td>
                  <td><input type="text" name="bus_number" value={formData.bus_number} onChange={handleChange} /></td>
                  <td>
                    <button onClick={() => handleUpdate(travel.travel_id)}>Save</button>
                    <button onClick={() => setEditingTravelId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
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
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
