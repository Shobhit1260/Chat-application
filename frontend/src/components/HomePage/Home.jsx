import React, { useEffect, useState } from 'react'
import LeftSideBar from './LeftSideBar'
import Chat from './Chat'
import RightSideBar from './RightSideBar'
import { useAuth0 } from '@auth0/auth0-react'

function Home() {
   const {getAccessTokenSilently}=useAuth0();
   const [users,setUsers]=useState([]);
    useEffect(()=>{
     const fetchUser=async()=>{
      const token= await getAccessTokenSilently();
      const res=await fetch("http://localhost:8000/v1/fetchuser",{
       method:"GET",
       headers:{
        "authorization":`Bearer ${token}`
       },
       credentials:"include"
      });
      const data=await res.json();
      console.log("data:",data);
      setUsers(data.users);
     }
     fetchUser();
   },[])
 
  return (
     <div className='w-11/12 h-[700px] text-white rounded-lg flex ' >
           <LeftSideBar users={users}/> 
           <Chat/>
           <RightSideBar/>
     </div>
  )
}

export default Home
