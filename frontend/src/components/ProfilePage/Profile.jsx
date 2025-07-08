import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout ,getAccessTokenSilently} = useAuth0();
  const text="Loading your Profile ...";
   console.log("user:", user);
  useEffect(()=>{
     const sendtokentoBackend=async()=>{
     const token= await getAccessTokenSilently();
     console.log("frontent token:",token);
     const res=await fetch('http://localhost:8000/v1/storeuser',{
      method:"POST",
      headers:{
       'content-type':'application/json',
       'authorization':`Bearer ${token}`
      },
      body:JSON.stringify(user),
      credentials: "include"
     })
     const data= await res.json();
     console.log("data:",data);
     }
      if(isAuthenticated){
       sendtokentoBackend();
     }
  },[isAuthenticated,getAccessTokenSilently])


 
  if (isLoading) {
    return (
      <div className="text-white text-2xl animate-pulse text-center mt-20">
        Loading the profile
      </div>
    );
  }

  return (
    isAuthenticated && (
      <div className="text-white font-sans w-full sm:w-2/3 md:w-1/2 lg:w-1/2 h-[600px] backdrop-blur bg-white/10 rounded-2xl p-8 mx-auto mt-10 shadow-xl flex flex-col justify-start items-center gap-6 animate-fade-in">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500 blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
          <img
            src={user.picture}
            className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
            alt={user.name}
          />
        </div>

        <h2 className="text-4xl text-cyan-200 font-bold tracking-wide">Welcome, {user.name}</h2>

        <Link
          to="/chat"
          className="mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium rounded-xl shadow hover:scale-105 transform transition duration-300"
        >
          🚀 Enter Chat Room
        </Link>

        <button
          onClick={() => logout()}
          className="mt-6 px-5 py-2 bg-red-600 hover:bg-red-400 text-white rounded-lg shadow transition duration-300"
        >
          Logout
        </button>
      </div>
    )
  );
};



export default Profile;

