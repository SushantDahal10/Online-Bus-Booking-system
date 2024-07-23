import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Components/Home';
import Viewseat from './Components/Viewseat';
import Searchresult from './Components/Searchresult';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import Nav from './Admin/Main';
import Forgotpass from './Components/Forgotpass';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Sucess from './Components/Sucess';
import Cancel from './Components/Cancel';
import Otp from './Components/Enterotp';
import Tickets from './Components/Tickets';
import PassengerDetails from './Components/PassengerDetail';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Passwordchange from './Components/Passwordchange';
import store from './redux/Store';
import AdminLogin from './Admin/Adminlogin';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/passengerdetail' element={<PassengerDetails />} />
          <Route path='/search' element={<Searchresult />} />
          <Route path='/viewseat' element={<Viewseat />} />
          <Route path='/admin' element={<Nav />} />
          <Route path='/payment/success' element={<Sucess />} />
          <Route path='/payment/failed' element={<Cancel />} />
          <Route path='/yourticket' element={<Tickets />} />
          <Route path='/forgotpassword' element={<Forgotpass />} />
          <Route path='/changepassword' element={<Passwordchange />} />
          <Route path='/otp' element={<Otp />} />
          <Route path='/adminlogin' element={<AdminLogin></AdminLogin>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
