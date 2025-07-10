import React, { useEffect, useState } from 'react';
import logo_icon from '../../chat-app-assests/logo_icon.svg';
import help_icon from '../../chat-app-assests/help_icon.png';
import send_button from '../../chat-app-assests/send_button.svg';
import gallery_icon from '../../chat-app-assests/gallery_icon.svg'

import { useSelector,useDispatch } from 'react-redux'
import { io } from "socket.io-client";
const socket = io("http://localhost:8000");


function Chat() {
    const userSelected= useSelector((state)=>state?.userSelected.value);
    const me=useSelector((state)=>(state?.me.value))
    const [message,setmessage]=useState("");
    const [receivedmsg,setrecievedmsg]=useState([]);
    const [sendMsg,setSendMsg]=useState([]);
    useEffect(()=>{
       const chat = async () => {
         socket.emit('setup',me._id);
         socket.on("receivedPrivatemessage",(data)=>{
            setrecievedmsg(data);
         })
       }
       chat();
    }, [me])

    const sendmsg = (e) => {
       e.preventDefault();
    socket.emit("sendPrivateMessage", {
      toUserId: userSelected._id,
      sendMsg:message
    });
    setSendMsg([...sendMsg,message]);
    console.log("privatemsg:",sendMsg)
    setmessage("");
  };
    
    const handlechange=(e)=>{
        setmessage(e.target.value)  
     }
     
  return (
    <>
      {
        !userSelected ?
          <div className='w-1/2 backdrop-blur-lg bg-white/10 flex flex-col  gap-4 justify-center  items-center rounded-r-xl'>
            <img src={logo_icon} alt="logo" className='w-32 aspect-[1/1] '/>
            <div className='text-2xl'>chat anytime, anywhere</div>
          </div>
          :
          <div className='flex flex-col justify-between  w-[600px] backdrop-blur bg-white/10 p-4'>
            <div className='flex h-10 justify-between items-center gap-4 p-4'>
                <div className='flex h-full justify-start items-center gap-2'>
                <img className="w-8 aspect-[1/1] rounded-full object-center" src={userSelected.picture} alt="photo" />
                <div className='text-xl'>{userSelected?.nickname}</div>
                <div className="w-2 aspect-[1/1] rounded-full bg-green-500"></div>
                </div>
                <div><img src={help_icon} alt="" /></div>

            </div>
            <div className='relative overflow-y-[scroll] p-4'>
                <h1 className="absolute top-0 left-4">{receivedmsg}</h1>
                <h1 className="absolute top-8 right-4">{sendMsg}</h1>
            </div>
            <form className='flex gap-4 '>
                <div className='flex rounded-2xl w-11/12 justify-between items-center bg-white/10 py-2 px-4 '>
                    <input type="text" name="message" value={message} onChange={handlechange} placeholder="send a message...." className='bg-transparent outline-none'/>
                    <img src={gallery_icon} alt="" /> 
                </div>
                <button onClick={sendmsg} >
                <img src={send_button} alt="" />
                </button>
            </form>
          </div>
      }
     
    </>
  )
}

export default Chat


