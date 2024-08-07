  import React from 'react';
  import { useSelector } from 'react-redux';
  import { useNavigate } from 'react-router-dom';
  import '../CSS/Payment.css'; 
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  export default function Payment(props) {
    const selectedSeats = useSelector(state => state.busprice.selectedSeats);
    const { paymentdetail } = props;
  
    const quantity = useSelector(state => state.busprice.quantity);
    const price = quantity * paymentdetail.fare;
    const navigate = useNavigate();
    if (!paymentdetail) {
      console.error('Missing payment detail');
      return null; 
    }
    const makePayment = () => {
      const checkToken = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tokencheck`, {
                method: 'GET',
                credentials: 'include'
            });
          if(response.ok){
            navigate(`/passengerdetail?price=${price}&travel_id=${paymentdetail.travel_id}&date_of_travel=${paymentdetail.date_of_travel}`);
          }
          else{
            alert('please login first')
            navigate('/login')
            // toast.error('Please login first', {
            //   autoClose: 700, 
            //   onClose: () => {
            //       setTimeout(() => {
            //           navigate('/login');
            //       }, 0.02);  
            //   }
             
          // });
           
          }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    checkToken();
    

    }

    return (
      
      <div className="payment-container">
              <ToastContainer />
        <div className="payment-card">
          <h2 className="card-title">Payment Summary</h2>

          
          <div className="section">
            <h3 className="section-title">Boarding & Dropping</h3>
            <div className="details">
              <div className="detail-item">
                <div className="dot boarding"></div>
                <div className="detail-content">
                  <p className="detail-location">{paymentdetail.from}</p>
                  <p className="detail-time">{paymentdetail.departure}</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="dot dropping"></div>
                <div className="detail-content">
                  <p className="detail-location">{paymentdetail.to}</p>
                  <p className="detail-time">{paymentdetail.arrival}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Numbers */}
          <div className="section">
            <h3 className="section-title">Seat Numbers</h3>
            <div className="seats">
              {selectedSeats.map((seatnumber, index) => (
                <span key={index} className="seat-number">{seatnumber}</span>
              ))}
            </div>
          </div>

    
          <div className="section">
            <h3 className="section-title">Fare Details</h3>
            <div className="fare-details">
              <p className="fare-label">Amount</p>
              <p className="fare-amount">INR {price}</p>
            </div>
          
          </div>

          <button 
            className="proceed-button" 
            onClick={makePayment}
          >
            PROCEED TO BOOK
          </button>
        </div>
      </div>
    );
  }
