import React, { useEffect, useState } from 'react';
import '../CSS/PassengerDetails.css';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const PassengerDetails = () => {
  const selectedSeats = useSelector(state => state.busprice.selectedSeats);
  const params = new URLSearchParams(window.location.search);
  const price = params.get('price');
  const travel_id = params.get('travel_id');
  const [isProcessing, setIsProcessing] = useState(false);
  const [passenger, setPassenger] = useState(
    selectedSeats.map(seatnumber => ({
      seatnumber,
      name: '',
      gender: '',
      age: '',
    }))
  );
  const [contactDetails, setContactDetails] = useState({
    contactemail: '',
    phone: ''
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminToken = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admintokencheck`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!res.ok) {
          setError('Please log in first.');
          setIsAuthorized(false);
          return;
        }

        const data = await res.json();
        console.log('Token is valid:', data);
        setIsAuthorized(true);
      } catch (err) {
        console.error('Error checking token:', err);
        setError('An error occurred while checking token. Please try again.');
        setIsAuthorized(false);
      }
    };

    checkAdminToken();
  }, []);

  const handlePassenger = (index, field, value) => {
    const newPassenger = [...passenger];
    newPassenger[index][field] = value;
    setPassenger(newPassenger);
  };

  const handleContactChange = (field, value) => {
    setContactDetails(prevDetails => ({ ...prevDetails, [field]: value }));
  };

  const makePayment = async () => {
    passenger.forEach((value, index) => {
      if (value.age < 1) {
        toast.error("Age should be greater than 1",{
          autoClose:900
        });
        
        return ;
      }
    });
    const stripe = await loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);
    
   

    const objs = {
      travel_id: travel_id,
      passenger: passenger,
      contactDetails: contactDetails,
      price: price,
      date_of_travel: params.get('date_of_travel')
    };
    localStorage.setItem('detailofpassengers', JSON.stringify(objs));

    const body = {
      selectedSeats: selectedSeats,
      price: price,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/create-checkout-session`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('redirecting...')
        const session = await response.json();
        const result = await stripe.redirectToCheckout({
          sessionId: session.id
        });
        if (result.error) {
          console.error('Error redirecting to checkout:', result.error.message);
        }
      } else {
        const errorText = await response.text();
        toast.error('Unexpected error: ' + errorText,{
          autoClose:900
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An error occurred: ' + error.message,{
        autoClose:900
      });
    }
  };

  if (!price) {
    return (
      <div className="loading">Loading...</div>
    );
  }

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="passenger-details-container">
        {isAuthorized ? (
          <div className="container">
            <h2 className="title">Passenger Details</h2>
            {selectedSeats.map((value, index) => (
              <div key={index} className="section">
                <h3 className="section-title">
                  <span role="img" aria-label="passenger">👤</span> Passenger {index + 1} Information
                </h3>
                <div className="form-group">
                  <label htmlFor={`name_${index}`}>Seat <strong className='seat-number'>{value}</strong></label>
                  <input 
                    type="text" 
                    id={`name_${index}`} 
                    name='name' 
                    placeholder="Name" 
                    value={passenger[index].name} 
                    onChange={(e) => handlePassenger(index, 'name', e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <div className="radio-group">
                    <input 
                      type="radio" 
                      id={`male_${index}`} 
                      name={`gender_${index}`} 
                      value="male" 
                      onChange={(e) => handlePassenger(index, 'gender', e.target.value)} 
                      required 
                    />
                    <label htmlFor={`male_${index}`}>Male</label>
                    <input 
                      type="radio" 
                      id={`female_${index}`} 
                      name={`gender_${index}`} 
                      value="female" 
                      onChange={(e) => handlePassenger(index, 'gender', e.target.value)} 
                      required 
                    />
                    <label htmlFor={`female_${index}`}>Female</label>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor={`age_${index}`}>Age</label>
                  <input 
                    type="number" 
                    id={`age_${index}`} 
                    name='age' 
                    placeholder="Age" 
                    value={passenger[index].age} 
                    onChange={(e) => handlePassenger(index, 'age', e.target.value)} 
                    required 
                  />
                </div>
              </div>
            ))}

            <div className="section">
              <h3 className="section-title">
                <span role="img" aria-label="contact">✉️</span> Contact Details
              </h3>
              <p className="info-text">You can download your ticket through website from the top right account icon</p>
              <div className="form-group">
                <label htmlFor="email">Email ID</label>
                <input 
                  type="email" 
                  id="email" 
                  name='contactemail' 
                  placeholder="Email ID" 
                  onChange={(e) => handleContactChange('contactemail', e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <div className="phone-input">
                  <select id="phone-code">
                    <option value="+91">+91</option>
                  </select>
                  <input 
                    type="tel" 
                    id="phone" 
                    placeholder="Phone" 
                    name='phone' 
                    onChange={(e) => handleContactChange('phone', e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="footer">
              <p>Total Amount: <strong>INR {price}</strong> <span className="exclusive">(*Exclusive of Taxes)</span></p>
              <button className="proceed-button" onClick={makePayment} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'PROCEED TO PAY'}
              </button>
              <p className="agreement">
                By clicking on proceed, I agree that I have read and understood the <a href="#">TnCs</a> and the <a href="#">Privacy Policy</a>
              </p>
            </div>
          </div>
        ) : (
          <div className="error-message">
            <p>{error}</p>
            {error === 'Please log in first.' && (
              <button onClick={() => navigate('/login')} className="login-button">
                Go to Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerDetails;
