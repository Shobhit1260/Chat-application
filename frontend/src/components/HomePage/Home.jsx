import React, { useEffect, useState } from 'react'
import LeftSideBar from './LeftSideBar'
import Chat from './Chat'
import RightSideBar from './RightSideBar'
import { useAuth0 } from '@auth0/auth0-react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

function Home() {
   const {getAccessTokenSilently}=useAuth0();
   const [users,setUsers]=useState([]);

    const [socket, setSocket] = useState(null);
    const [onlineUserIds, setOnlineUserIds] = useState([]);
   const me = useSelector((state) => state?.me?.value);

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

   useEffect(() => {
     const newsocket = io('http://localhost:8000',{
     query:{userId: me?._id}
     });
     console.log("me:",me._id);
     console.log("newsocket:",newsocket);
     setSocket(newsocket);
     newsocket.on("online-users", (users) => {
       setOnlineUserIds(users); 
     });
   
     return () => {
       newsocket.disconnect();
     };
   }, []);
 
  return (
     <div className='w-11/12 h-[700px] text-white rounded-lg flex justify-center items-center ' >
           <LeftSideBar users={users} socket={socket} onlineUserIds={onlineUserIds}/> 
           <Chat socket={socket} onlineUserIds={onlineUserIds}/>
           
     </div>
  )
}

export default Home
