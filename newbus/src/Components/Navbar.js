import React, { useEffect, useState } from 'react';
import { LuBus } from "react-icons/lu";
import { RiCustomerServiceLine } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import '../CSS/Navbar.css';
import logo from '../Components/Images/download.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar() {
  const [showAccount, setShowAccount] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAccount = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getsuseremail`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        });
        if (response.ok) {
          setLoggedin(true);
        } else {
          setLoggedin(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    handleAccount();
  }, []);

  const accountClick = () => {
    setShowAccount(!showAccount);
  };

  const handleSignout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setLoggedin(false);
        toast.success('Successfully logged out', {
          autoClose: 600,
          onClose: () => {
            setTimeout(() => {
              navigate('/');
            }, 0.02);
          }
        });
      } else {
        console.log('Signout failed');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <ToastContainer />
      <nav className='navbar'>
        <div className='logo' onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" />
       
        </div>
        <div className="nav-items">
          <div className='nav-item'>
            <RiCustomerServiceLine />
            <span>Help</span>
          </div>
          <div className='nav-item' onClick={accountClick}>
            <MdAccountCircle />
            <span>Account</span>
            <div className={`dropdown-menu ${showAccount ? 'show' : ''}`}>
              {!loggedin ? (
                <>
                  <div onClick={() => navigate('/login')}>Sign In</div>
                  <div onClick={() => navigate('/signup')}>Sign Up</div>
                  <div onClick={() => navigate('/')}>Home</div>
                </>
              ) : (
                <>
                  <div onClick={handleSignout}>Sign Out</div>
                  <div onClick={() => navigate('/yourticket')}>Tickets</div>
                  <div onClick={() => navigate('/')}>Home</div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
