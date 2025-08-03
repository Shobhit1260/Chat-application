import React, { useEffect, useState } from 'react'
import LeftSideBar from './LeftSideBar'
import Chat from './Chat'
import RightSideBar from './RightSideBar'
import { useAuth0 } from '@auth0/auth0-react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'

function Home() {
    const dispatch = useDispatch();
   const {getAccessTokenSilently}=useAuth0();
   const [LeftSideBarData,setLeftSideBar]=useState({users:[],groups:[]} );
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [onlineUserIds, setOnlineUserIds] = useState([]);
   const me = useSelector((state) => state?.me?.value);
   const token = useSelector((state) => state?.token?.value);
    useEffect(()=>{
     const fetchLeftSideBarData=async()=>{ 
      const res1=await fetch("http://localhost:8000/v1/fetchusers",{
       method:"GET",
       headers:{
        "authorization":`Bearer ${token}`
       },
       credentials:"include"
      });
      
      const data=await res1.json();
      const users = data.users || [];

      const res2=await fetch("http://localhost:8000/v1/fetchgroups",{
       method:"GET",
       headers:{
        "authorization":`Bearer ${token}`
       },
       credentials:"include"
      });
      const data2=await res2.json();
      const groups= data2.groups || [];
        setLeftSideBar({users,groups});
     }
     fetchLeftSideBarData();
   },[])

   useEffect(() => {
     const fetchUsers = async () => {
       const res = await fetch("http://localhost:8000/v1/fetchusers", {
         method: "GET",
         headers: {
           "authorization": `Bearer ${token}`
         },
         credentials: "include"
       });
       const users = await res.json();
       setUsers((prev) => ({ ...prev, users }));
     };
     fetchUsers();
   }, [getAccessTokenSilently]);

   useEffect(() => {
     const newsocket = io('http://localhost:8000',{
     query:{userId: me?._id}
     });
     
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
           <LeftSideBar leftSideBarData={LeftSideBarData} users={users} socket={socket} onlineUserIds={onlineUserIds}/> 
           <Chat socket={socket} onlineUserIds={onlineUserIds}/>
           {/* <RightSideBar />  */}
     </div>
  )
}

export default Home;



