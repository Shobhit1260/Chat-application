import React, { useState,useEffect } from 'react'
import favicon from '../../chat-app-assests/favicon.svg'
import Menu from '../../chat-app-assests/menu_icon.png';
import search_icon from '../../chat-app-assests/search_icon.png';
import {setSelectedUser,clearSelectedUser} from '../../Redux/UserSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react';

function LeftSideBar({users}) {
  const [menu,setMenu]=useState(false);
  const [groupMembers,setGroupMembers]=useState([]);
  const dispatch= useDispatch();
  const selectedUser= useSelector((state)=>state?.userSelected.value)
  const {logout} = useAuth0(); 
  const [showUsers, setShowUsers] = useState(false);

  return (
    <div className={`flex flex-col gap-4 justify-start items-center  w-[500px] h-[100%] px-4 py-4 backdrop-bg bg-white/20 rounded-l-xl `}>
       <div className='flex justify-between items-center p-2 w-full'>
         <div className="flex gap-2 items-center">
            <img src={favicon} className="w-8 aspect-[1/1] rounded-full object-cover"  alt="logo" />
            <p className='text-xl  font-semibold'>Quick Chat</p>
         </div>
         <div className="w-5 aspect-[1/1] rounded-full relative ">
            <img src={Menu} alt="menu" onClick={()=>setMenu(!menu)}/>
            {menu ? 
             <div className='z-40 absolute top-0 right-5 p-4 rounded-lg backdrop-blur bg-white flex flex-col gap-1 w-max h-min'>
              <h1 className='font-serif text-sm text-gray-600 cursor-default' onClick={()=>logout()}>logout</h1> 
              <h2 className='font-serif text-sm text-gray-600 cursor-default' onClick={()=>setShowUsers(!showUsers)}>Create group</h2>
             </div>:null
            }
            {showUsers?
            <div className='fixed inset-0 p-4 bg-white/20 bg-opacity-10 flex flex-col justify-center items-center overflow-y-scroll'>
           {
          users.map((user)=>{
            return (
               console.log("user:",users.length),
                users.map((user) => (
                    <div key={user._id} className={`w-1/2 h-[700px] px-4 flex gap-2 justify-start items-center relative rounded-xl cursor-pointer transition
                        `}>
                      <div className="w-8 aspect-[1/1] rounded-full overflow-hidden">
                        <img src={user.picture} alt="profile" className="w-full h-full object-cover" />
                      </div>
                        <div className="font-sm">{user.nickname}</div>
                        
                    </div>   
                 )))
          })} 
       </div>:null     
          }
         </div>
       </div>
       <div className='w-full flex justify-start items-center gap-2 h-12 rounded-xl backdrop-blur bg-white/50 px-4 py-2 text-white text-lg'>
         <div className='w-5 aspect-[1/1]  '>
          <img src={search_icon} alt="search" className='object-cover' />
         </div>
         <input type="text" placeholder="Search..." className='z-[-90] outline-none w-11/12  h-[100%] bg-transparent'  />
       </div>
       
      <div className='overflow-y-scroll mx-4 my-4 w-full flex flex-col gap-2'>      {
    users.map((user, index) => (
    <div onClick={()=>dispatch(setSelectedUser(user)) } key={user._id} className={`w-full px-4 flex gap-2 justify-start items-center relative rounded-xl cursor-pointer transition
        ${selectedUser === user._id ? 'backdrop-blur bg-white/30' : ''}`}>
      <div className="w-8 aspect-[1/1] rounded-full overflow-hidden">
        <img src={user.picture} alt="profile" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col">
        <div className="font-sm">{user.nickname}</div>
        <div className={index > 2 ? "text-gray-400" : "text-yellow-500"}>
          {index > 2 ? "Offline" : "Online"}
        </div>
      </div>

      {index > 3 && <div className="absolute right-2 backdrop-blur bg-white/50 w-4 aspect-[1/1] rounded-full flex justify-center items-center text-sm text-gray-500">{index}</div>}
    </div>
  ))
  
}

  </div>     
    </div>
  )
}

export default LeftSideBar
