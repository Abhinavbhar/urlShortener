'use client'
import axios, { Axios } from 'axios';
import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function page() {
  const router = useRouter()
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('')
    const [username,setUsername]=useState('');
    const handleSignUp = async (e) => {
      e.preventDefault();
    
      if (confirmPassword !== password) {
        alert("Both passwords are different");
        return;
      }
    
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`,
          { username, password },
          { withCredentials: true }
        );
    
        if (response.status === 200) {
          router.push('/dashboard', { scroll: false });
        } else {
          alert(response.data);
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          alert(`Error: ${error.response.data}`);
        } else if (error.request) {
          alert('No response from server. Please try again later.');
        } else {
          // Something happened in setting up the request that triggered an Error
          alert(`Error: ${error.message}`);
        }
      }
    };
    
  return (
<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 mt-40">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/>
    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form className="space-y-6" action="#" method="POST">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
        <div className="mt-2">
          <input id="username" name="username" type="username" autoComplete="username" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={(e)=>{setUsername(e.target.value)}} value={username}/>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div className="text-sm">
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div>
        </div>
        
        <div className="mt-2">
          <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={(e)=>{setPassword(e.target.value)}} value={password}/>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Confirm password</label>
          
        </div>
        
        <div className="mt-2">
          <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={(e)=>{setConfirmPassword(e.target.value)}} value={confirmPassword}/>
        </div>
      </div>
      <div>
        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={(e)=>{handleSignUp(e)}}>Sign up</button>
      </div>
    </form>

    
  </div>
</div>  )
}

export default page