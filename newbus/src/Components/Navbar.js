import React, { useEffect, useState } from 'react';
import '../App.css';
import { LuBus } from "react-icons/lu";
import { RiCustomerServiceLine } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [showAccount, setShowAccount] = useState(false);
  const [loggedin, setloggedin] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const handleaccount = async () => {
      try {
        const response = await fetch('http://localhost:8000/getsuseremail', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        });
        if (response.ok) {
          setloggedin(true);
        } else {
          setloggedin(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    handleaccount();
  }, []);

  const accountClick = () => {
    setShowAccount(!showAccount);
  };

  const handlesignout = async () => {
    try {
      const response = await fetch('http://localhost:8000/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setloggedin(false);
        alert('sucessfully logged out')
        Navigate('/');
      } else {
        console.log('Signout failed');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <nav className='bg-white'>
        <div className='flex justify-between items-center ml-36 xs:ml-2'>
          <LuBus className='h-20 w-20 xs:h-12 xs:w-12' onClick={() => Navigate('/')} />
          <div className="flex space-x-8 xs:space-x-4 mr-40 xs:mr-2">
            <div className='flex flex-col items-center'>
              <RiCustomerServiceLine className='w-6 h-6 xs:w-4 xs:h-4' />
              <span className='text-base xs:text-sm'>help</span>
            </div>
            <div className='flex flex-col items-center relative' onClick={accountClick} >
              <MdAccountCircle className='w-6 h-6 xs:w-4 xs:h-4' />
              <span className='text-base xs:text-sm'>account</span>
              {loggedin === false &&
                <div id='account' className={`absolute top-full right-0 ${showAccount ? 'flex' : 'hidden'} flex-col bg-white border mt-2 p-2 z-50`}>
                  <div className="signin hover:bg-blue-700 cursor-pointer" onClick={() => Navigate('/login')}>Signin</div>
                  <div className="signup hover:bg-blue-700 cursor-pointer" onClick={() => Navigate('/signup')}>Signup</div>
               
                </div>}
              {loggedin === true &&
                <div id='account' className={`absolute top-full right-0 ${showAccount ? 'flex' : 'hidden'} flex-col bg-white border mt-2 p-2 z-50`}>
                  <div className="signin hover:bg-blue-700 cursor-pointer" onClick={handlesignout}>Signout</div>
                  <div className="signup hover:bg-blue-700 cursor-pointer" onClick={() => Navigate('/yourticket')}>Tickets</div>
                </div>}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
