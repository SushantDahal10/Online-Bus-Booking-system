import React from 'react';    
import Navbar from './Navbar';
import Main from './Main'
import Footer from './Footer';

export default function Home() {
  localStorage.clear()
  return (
    <div className='mainhome'>
     <Navbar></Navbar>
     <Main></Main>
     <Footer></Footer>
    </div>
  );
}
