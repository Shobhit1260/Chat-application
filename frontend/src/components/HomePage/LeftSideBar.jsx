import React, { useState,useEffect } from 'react'
import favicon from '../../chat-app-assests/favicon.svg'
import Menu from '../../chat-app-assests/menu_icon.png';
import search_icon from '../../chat-app-assests/search_icon.png';
import {setSelectedUser,clearSelectedUser} from '../../Redux/UserSlice.js'
import { useSelector, useDispatch } from 'react-redux'


function LeftSideBar({users}) {
  const [menu,setMenu]=useState(false);
  const dispatch= useDispatch();
  const selectedUser= useSelector((state)=>state?.userSelected.value)

  return (
    <div className={`flex flex-col gap-4 justify-start items-center  ${!selectedUser? 'w-1/2' : 'w-1/3'} h-[100%] px-4 py-4 backdrop-bg bg-white/20 rounded-l-xl `}>
       <div className='flex justify-between items-center p-2 w-full'>
         <div className="flex gap-2 items-center">
            <img src={favicon} className="w-8 aspect-[1/1] rounded-full object-cover"  alt="logo" />
            <p className='text-xl  font-semibold'>Quick Chat</p>
         </div>
         <div className="w-5 aspect-[1/1] rounded-full">
            <img src={Menu} alt="menu" onClick={()=>setMenu(!menu)}/>
            {menu ? 
             <div className='backdrop-blur bg-white/30 flex flex-col gap-1'>
                
             </div>:null
            }
         </div>
       </div>
       <div className='w-full flex justify-start items-center gap-2 h-12 rounded-xl backdrop-blur bg-white/50 px-4 py-2 text-white text-lg'>
         <div className='w-5 aspect-[1/1]  '>
          <img src={search_icon} alt="search" className='object-cover' />
         </div>
         <input type="text" placeholder="Search..." className='outline-none w-11/12  h-[100%] bg-transparent'  />
       </div>
       
            {
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
  )
}

export default LeftSideBar
