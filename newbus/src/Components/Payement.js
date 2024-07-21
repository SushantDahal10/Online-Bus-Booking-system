import React from 'react';
import { useSelector } from 'react-redux';
import {loadStripe} from '@stripe/stripe-js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Payment(props) {
 
  const selectedSeats = useSelector(state => state.busprice.selectedSeats);
  const {paymentdetail}=props;
  const quantity=useSelector(state=>state.busprice.quantity)
  const seatnumbers=useSelector(state=>state.busprice.selectedSeats)
  const price=quantity*paymentdetail.fare;
  const Navigate=useNavigate()
  
 
  const makepayment = async () => {
Navigate(`/passengerdetail?price=${price}&travel_id=${paymentdetail.travel_id}`)
  }

  

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-white w-80 p-6 shadow-md rounded-lg">
        <div className="mb-0">
          <h2 className="text-base font-bold text-gray-700 mb-2">Boarding & Dropping</h2>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-black rounded-full mr-2"></div>
            <div className="flex-grow">
              <div className="text-sm font-bold text-gray-700">{paymentdetail.from}</div>
            
            </div>
            <div className="text-base font-bold text-gray-700">{paymentdetail.departure}</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
            <div className="flex-grow">
              <div className="text-sm font-bold text-gray-700">{paymentdetail.to}</div>

            </div>
            <div className="text-base font-bold text-gray-700">{paymentdetail.arrival}</div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-700 mb-2">Seat No.</h2>
          <div className="flex space-x-4">
          {seatnumbers.map((seatnumber, index) => {
  return (
    <div key={index} className="text-base font-bold text-gray-700">
      {seatnumber}
    </div>
  );
})}
</div>

        </div>

        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-700 mb-2">Fare Details</h2>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-600">Amount</div>
            <div className="text-base font-bold text-gray-700">INR {price}</div>
          </div>
          <div className="text-xs text-gray-600 mb-2">Taxes will be calculated during payment</div>
          <div className="text-sm text-red-600 cursor-pointer">Show Fare Details</div>
        </div>

        <button className="w-full py-3 bg-red-600 text-white rounded-md font-bold text-base cursor-pointer hover:bg-red-700" onClick={makepayment}>
          PROCEED TO BOOK
        </button>
      </div>
    </div>
  );
}
