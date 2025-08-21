import React, { useState,useEffect } from 'react'
import favicon from '../../chat-app-assests/favicon.svg'
import Menu from '../../chat-app-assests/menu_icon.png';
import search_icon from '../../chat-app-assests/search_icon.png';
import {setSelectedUser,clearSelectedUser} from '../../Redux/UserSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { setUsersandGroup } from '../../Redux/usersandGroup.jsx';



function LeftSideBar({leftSideBarData}) {
   const dispatch= useDispatch();
   const {logout} = useAuth0(); 

  const selectedUser= useSelector((state)=>state?.userSelected?.value)
  const me = useSelector((state) => state?.me?.value);
  const token=localStorage.getItem("token");
  const [menu,setMenu]=useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [members, setMember] = useState(false);

  const [groupName,setgroupName]=useState("");
  const [memberSelected,setMemberSelected]=useState([]);
  

  const changeHandler=(e)=>{
    const userId = e.target.id;
    if (e.target.checked) {
      setMemberSelected((prev) => [...prev, userId]);
    } else {
      setMemberSelected((prev) => prev.filter((id) => id !== userId));
    }  
  }
  
  const createGroup=async(e)=>{
    e.preventDefault();
    const res=await fetch("http://localhost:8000/v1/creategroup",{
      method:"POST",
      credentials:"include",
      headers:{
        "Content-Type":"application/json",
        authorization:`Bearer ${token}`
      },
      body:JSON.stringify({
        nickname:groupName,
        membersId:memberSelected
      })
    })
    const data=await res.json();
    if(!data.success)
      toast.error(data.message);
    else{
      setShowUsers(false)
      setgroupName("");
      setMemberSelected([]);
      toast.success(data.message);
    }
    console.log("data",data);
  }
  const getColorFromName = (name) => {
  const colors = [
    "#FF5733", 
    "#33B5FF", 
    "#28A745", 
    "#FFC107", 
    "#9C27B0",  
    "#FF9800", 
    "#00BCD4",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash % 7);
  return colors[index];
};


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
              <h1 className='font-serif text-sm text-gray-600 cursor-default' 
              onClick={
                ()=>{
                logout()
              }
              }>logout</h1> 
              <h2 className='font-serif text-sm text-gray-600 cursor-default' onClick={()=>setShowUsers(!showUsers)}>Create group</h2>
             </div>:null
            }
          {showUsers && (
     <div className="z-40 fixed inset-0 p-4 bg-white/20 bg-opacity-10 flex flex-col justify-center items-center ">
       <div className="w-1/2 h-[900px] pt-8 pb-4 px-8 bg-white flex flex-col gap-8 justify-center items-center relative rounded-xl overflow-y-scroll">
        <h1 className="text-2xl  font-bold text-black mx-auto font-serif">Create a New Group</h1>

      <form className='flex flex-col gap-4  w-full' onSubmit={createGroup}>
        <div className='flex w-full gap-4 justify-center items-center h-20 px-2 '>
        <label htmlFor="groupName" className="text-black font-medium min-w-max text-lg ">Group Name:</label>
        <input
          id="groupName"
          type="text"
          className=" text-black border border-gray-300 rounded-md p-2 outline-none w-full"
          name="groupName"
          value={groupName}
          onChange={(e) => setgroupName(e.target.value)} 
        />
        </div>
      <div className='flex flex-col  gap-4 w-full'>
        {leftSideBarData.users?.map(
        (user) => (
          <div
            key={user._id}
            className="w-full flex justify-between items-center gap-8"
          >
            <div className="w-3/4 flex justify-start items-center gap-8">
              <div className="w-8 aspect-square rounded-full overflow-hidden bg-gray-200">
                <img
                  src={user.picture}
                  alt={user.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-black">{user.nickname}</span>
            </div>

            <div className="w-1/4 flex justify-end">
              <input
                type="checkbox"
                id={`${user._id}`}
                onChange={changeHandler}
                className="h-5 w-5"
              />
            </div>
          </div>
        ))}
        </div>
      <div className='flex justify-around items-center w-full'>
        <input
          type="submit"
          value="Create Group"
          className="p-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
        />
        <button onClick={() => setShowUsers(!showUsers)} className='top-9 right-2 absolute'>
          <span className="text-red-500 hover:text-red-800 font-semibold p-2 rounded-lg">Close</span>
        </button>

        </div>
      </form>
    </div>
  </div>
)}
         </div>
       </div>
       <div className='w-full flex justify-start items-center gap-2 h-12 rounded-xl backdrop-blur bg-white/50 px-4 py-2 text-white text-lg'>
         <div className='w-5 aspect-[1/1]  '>
          <img src={search_icon} alt="search" className='object-cover' />
         </div>
         <input type="text" placeholder="Search..." className='z-[-90] outline-none w-11/12  h-[100%] bg-transparent'  />
       </div>
       
      <div className='overflow-y-scroll mx-4 my-4 w-full flex flex-col gap-4'>     
   { leftSideBarData.users?.map((user, index) => (
    
    <div
     onClick={()=>dispatch(setSelectedUser(user)) } 
     key={user._id} className={`w-full px-4 flex gap-2 justify-start items-center relative rounded-xl cursor-pointer transition
    ${selectedUser._id === user._id ? 'backdrop-blur bg-white/30 p-2' : ''}`}>
      <div className="w-8 aspect-[1/1] rounded-full overflow-hidden">
        <img src={user.picture} alt="profile" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col">
        <div className="font-sm">{user.nickname}</div>
      </div>
    </div>
  ))
  
}
{ leftSideBarData.groups?.map((group, index) => (
    group.members.includes(me?._id)
   && (<div
     onClick={()=>dispatch(setSelectedUser(group)) } 
     key={group._id} className={`w-full px-4 flex gap-2 justify-start items-center relative rounded-xl cursor-pointer transition
    ${selectedUser._id === group._id ? 'backdrop-blur bg-white/30 p-2 ' : ''}`}>
      <div className="w-8 aspect-[1/1] rounded-full overflow-hidden flex justify-center items-center"
        style={{ backgroundColor: getColorFromName(group.nickname|| 'alpha') }}>
        {group.nickname?.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-col">
      <div className="font-sm">{group.nickname}</div>
       
      </div>
    </div>)
  ))
  
}

  </div>     
    </div>
    
  )
}

export default LeftSideBar
