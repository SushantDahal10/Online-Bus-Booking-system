import React, { useEffect, useState } from 'react';
import '../CSS/Passwordchange.css';
import { useNavigate } from 'react-router-dom';
export default function Passwordchange() {
    const [email, setEmail] = useState('');
    const Navigate=useNavigate()
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, []);
  const handleSubmit = async(e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const reenterPassword = document.getElementById('reenter-password').value;

    if (password !== reenterPassword) {
      alert("2 Passwords do not match");
      return;
    }
 try{
    const obj={email,password}
    const res = await fetch('http://localhost:8000/passwordchange', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj)
    })
    if (res.ok) {
        const data = await res.json();
        alert(data.message); 
        Navigate('/login')
       
  
    } else {
        const errorData = await res.json();
        alert(errorData.message); 
    }}
    catch(err){
        console.log(err)
    }



}
  
 





  return (
    <div className="password-change-container">
      <form className="password-change-form" onSubmit={handleSubmit}>
        <h2>Change Password</h2>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="reenter-password">Re-enter Password</label>
          <input type="password" id="reenter-password" name="reenter-password" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
