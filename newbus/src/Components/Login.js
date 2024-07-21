import React from 'react'
import { LuBus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'
import Footer from './Footer'
export default function Login() {
  const navigate=useNavigate();
  const handlesubmit=async(e)=>{
    e.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const obj = {
      email: email,
      password: password
  };
  console.log(email)
  try{
const response=await fetch('http://localhost:8000/login',{
  method:'POST',
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify(obj),
  credentials: 'include',
})
if (response.ok) {
  const data = await response.json();
  alert('sucessfully logged in');
  navigate('/');
} else {
  const errorData = await response.json();
  alert(errorData.message);
}
  }
  catch (error) {
    alert('An error occurred: ' + error.message);
}
 


  }
  return (
  
    <div>
        <Navbar></Navbar>
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <LuBus class="mx-auto h-10 w-auto"/>
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6"  method="POST" onSubmit={handlesubmit}>
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
        <div class="mt-2">
          <input id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div class="text-sm">
            <a   class="font-semibold text-indigo-600 cursor-pointer hover:text-indigo-500" onClick={()=>navigate('/forgotpassword')}>Forgot password?</a>
          </div>
        </div>
        <div class="mt-2">
          <input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>

      <div>
        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
      </div>
    </form>

 
  </div>
</div>
<Footer></Footer>
    </div>
  )
}
