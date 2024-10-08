import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admincss/Busdetail.css'; 
import Navbar from './Navbar';
import ConfirmationModal from './Confirmdelete';

export default function BusDetail() {
    const [busDetails, setBusDetails] = useState([]);
    const [editingBusNumber, setEditingBusNumber] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [formData, setFormData] = useState({
        bus_number: '',
        bus_name: '',
        contactno: '',
        capacity: ''
    });
    const [unauthorized, setUnauthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [busToDelete, setBusToDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchBusDetails();
    }, []);

    const fetchBusDetails = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/busdetail`, {
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
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/busadd`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.status === 401) {
                setUnauthorized(true);
                return;
            }

            if (response.ok) {
                alert('Bus Added Successfully');
            }
            fetchBusDetails();
            setFormData({ bus_number: '', bus_name: '', contactno: '', capacity: '' });
        } catch (err) {
            console.error('Error adding bus detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (bus_number) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/busupdate?bus_number=${bus_number}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.status === 401) {
                setUnauthorized(true);
                return;
            }

            if (response.ok) {
                alert('Bus Updated Successfully');
            }
            setEditingBusNumber(null);
            fetchBusDetails();
            setFormData({ bus_number: '', bus_name: '', contactno: '', capacity: '' });
        } catch (err) {
            console.error('Error updating bus detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (bus) => {
        setFormData(bus);
        setEditingBusNumber(bus.bus_number);
    };

    const handleDelete = (bus_number) => {
        setBusToDelete(bus_number);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/deletebus?bus_number=${busToDelete}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.status === 401) {
                setUnauthorized(true);
                return;
            }

            if (response.ok) {
                alert('Bus Deleted Successfully');
                fetchBusDetails();
            }
        } catch (err) {
            console.error('Error deleting bus detail:', err);
        } finally {
            setShowModal(false);
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
        setBusToDelete(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredBusDetails = busDetails.filter((bus) =>
        Object.values(bus).some((value) =>
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
        <div className="bus-detail-container">
            <Navbar handleSectionChange={handleSectionChange} />

            <h1>Bus Details</h1>

            <form onSubmit={handleAdd}>
                <input
                    type="text"
                    name="bus_number"
                    placeholder="Bus Number"
                    value={formData.bus_number}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="bus_name"
                    placeholder="Bus Name"
                    value={formData.bus_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="contactno"
                    placeholder="Contact No"
                    value={formData.contactno}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="capacity"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Add</button>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Bus Number</th>
                        <th>Bus Name</th>
                        <th>Contact No</th>
                        <th>Capacity</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredBusDetails.map((bus) => (
                        <tr key={bus.bus_number}>
                            {editingBusNumber === bus.bus_number ? (
                                <>
                                    <td><input type="text" name="bus_number" value={formData.bus_number} onChange={handleChange} disabled /></td>
                                    <td><input type="text" name="bus_name" value={formData.bus_name} onChange={handleChange} /></td>
                                    <td><input type="text" name="contactno" value={formData.contactno} onChange={handleChange} /></td>
                                    <td><input type="text" name="capacity" value={formData.capacity} onChange={handleChange} /></td>
                                    <td>
                                        <button onClick={() => handleUpdate(bus.bus_number)}>Save</button>
                                        <button onClick={() => setEditingBusNumber(null)}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{bus.bus_number}</td>
                                    <td>{bus.bus_name}</td>
                                    <td>{bus.contactno}</td>
                                    <td>{bus.capacity}</td>
                                    <td>
                                        <button onClick={() => handleEdit(bus)}>Edit</button>
                                        <button onClick={() => handleDelete(bus.bus_number)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <ConfirmationModal
                    message="Are you sure you want to delete this bus?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
}
