import React, { useState,useEffect } from 'react'
import favicon from '../../chat-app-assests/favicon.svg'
import Menu from '../../chat-app-assests/menu_icon.png';
import search_icon from '../../chat-app-assests/search_icon.png';
import {setSelectedUser,clearSelectedUser} from '../../Redux/UserSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react';
import { io } from 'socket.io-client';



function LeftSideBar({users,socket,onlineUserIds}) {
  const [menu,setMenu]=useState(false);
  const [groupMembers,setGroupMembers]=useState([]);
  const dispatch= useDispatch();
  const selectedUser= useSelector((state)=>state?.userSelected?.value)
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
            <div className='z-40 fixed inset-0 p-4 bg-white/20 bg-opacity-10 flex flex-col justify-center items-center overflow-y-scroll'>
           <div className=" w-1/2 h-min py-4 px-8  bg-white flex flex-col gap-8 justify-center items-start relative rounded-xl">
           <h1 className='text-2xl font-bold text-black mx-auto'>Create a new group</h1>
           <form action="">
            <label htmlFor="groupName">Group Name:</label>
            <input id="groupName" type="text" />
           {users.map((user)=>{
            return (
                    <div key={user._id} className={`w-full flex justify-center items-between gap-4
                       `}>
                      {/* <label htmlFor="userName">  */}
                      <div className='w-3/4 flex justify-start items-center gap-4'>
                      <div className="w-8 aspect-[1/1] rounded-full overflow-hidden">
                        <img src={user.picture} alt="profile" className="w-full h-full object-cover" />
                      </div>
                      <div className="font-sm text-black">{user.nickname}</div>
                      </div> 
                      {/* </label>  */}
                      <input  id="userName"  className='w-1/4 text-xl' type="checkbox" />
                       
                    </div>  

            )
          })
          }
          <input type="submit" value="Create Group" className='mx-auto p-4 bg-green-600 hover:bg-green-700' />
          </form>
          </div> 
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
        {onlineUserIds.includes(user._id) ?
          <div className= "text-green-400">
            Online
           </div>  :
          <div className= "text-red-700">
            Offline
          </div>
           
          
        }
      </div>
    </div>
  ))
  
}

  </div>     
    </div>
    
  )
}

export default LeftSideBar
