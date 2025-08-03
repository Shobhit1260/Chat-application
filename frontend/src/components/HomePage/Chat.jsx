import React, { useEffect, useState } from 'react';
import logo_icon from '../../chat-app-assests/logo_icon.svg';
import help_icon from '../../chat-app-assests/help_icon.png';
import send_button from '../../chat-app-assests/send_button.svg';
import gallery_icon from '../../chat-app-assests/gallery_icon.svg';

import { useSelector } from 'react-redux';


function Chat({socket,onlineUserIds}) {

  const userSelected = useSelector((state) => state?.userSelected?.value);
  const me = useSelector((state) => state?.me?.value);
  const token = useSelector((state)=> state?.token?.value);

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (!me || !userSelected || !socket) return;

    socket.emit('setup', me._id);

    const handleReceive = (data) => {
      setChatHistory((prev) => [...prev, data]);
    };

    socket.on('receivedPrivateMessage', handleReceive);
    socket.on('receivedGroupMessage', handleReceive);
    return () => {
      socket.off('receivedPrivateMessage', handleReceive);
      socket.off('receivedGroupMessage', handleReceive);
    };
  }, [me?._id,userSelected?._id]);


  useEffect(() => {
    if (!me?._id || !userSelected?._id) return;

    const fetchHistory = async () => {
      try {
       
        const res = await fetch(
          `http://localhost:8000/v1/fetchchathistory/${me._id}/${userSelected._id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          }
        );
        const data = await res.json();
        setChatHistory(data.messages || []);
      } catch (error) {
        console.error('Failed to fetch chat history:',error);
      }
    };

    fetchHistory();
  }, [userSelected?._id]);

  const sendmsg = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      sender: me._id,
      receiver: userSelected._id,
      receiverModel: isGroup? 'Group':'User',
      message,
      date: Date.now(),
    };

    // Emit message
    socket.emit('sendPrivateMessage', {
      toUserId: userSelected._id,
      message,
      fromUserId: me._id,
    });

    socket.emit('sendGroupMessage',{
      toGroupId: userSelected?._id,
      message,
      fromUserId:me?._id
    })
    
    // Add to chat history
    setChatHistory((prev) => [...prev, newMsg]);
    setMessage('');
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
 
const isGroup = Array.isArray(userSelected?.members) && userSelected.members.length > 0;

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
    <>
      {Object.keys(userSelected).length === 0? (
        <div className="w-1/2 h-[100%] backdrop-blur-lg bg-white/10 flex flex-col gap-4 justify-center items-center rounded-r-xl">
          <img src={logo_icon} alt="logo" className="w-32 aspect-[1/1]" />
          <div className="text-2xl">Chat anytime,anywhere</div>
        </div>
      ) : (
        !isGroup ?
        (
        <div className="z-0 flex flex-col justify-between w-[600px] h-[100%] backdrop-blur bg-white/10 rounded-r-lg ">
          <div className="flex h-16 justify-between items-center gap-4 p-4 backdrop-blur bg-white/30  rounded-r-lg">
            <div className="flex h-full justify-start items-center gap-2">
              <img
                className={`w-8 aspect-[1/1] rounded-full object-center  ${onlineUserIds.includes(userSelected._id) ? 'text-green-700 ' : ''}`}
                src={userSelected.picture}
                alt="photo"
              />
              <div className="text-lg min-w-max">{userSelected.nickname}
              {!isGroup && 
              (onlineUserIds.includes(userSelected._id) ? 
              <div className="text-green-500 font-semibold text-lg">Online</div> :
              <div className="text-gray-500 font-semibold text-lg">Offline</div>
              )}
               </div>
            </div>
            
          </div>

          <div className="flex flex-col gap-2 overflow-y-scroll h-[500px] px-2 py-4">
            {chatHistory.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`max-w-[70%] px-4 py-2 rounded-xl ${
                  msg.sender === me._id
                    ? 'self-end bg-blue-500 text-white'
                    : 'self-start bg-gray-300 text-black'
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          <form className="flex gap-4 p-4" onSubmit={sendmsg}>
            <div className="flex rounded-2xl w-11/12 justify-between items-center bg-white/10 py-2 px-4">
              <input
                type="text"
                name="message"
                value={message}
                onChange={handleChange}
                placeholder="Send a message..."
                className="bg-transparent outline-none w-full"
              />
              <img src={gallery_icon} alt="gallery" />
            </div>
            <button type="submit">
              <img src={send_button} alt="send" />
            </button>
          </form>
        </div>
        ):(    
        <div>
          <div className="flex h-16 justify-between items-center gap-4 p-4 backdrop-blur bg-white/30 rounded-r-lg">
            <div className="flex h-full justify-start items-center gap-2">
              <div
                className="w-8 aspect-[1/1] rounded-full flex justify-center items-center"
                style={{ backgroundColor: getColorFromName(userSelected.nickname) }}
              >
                {userSelected.picture ? (
                  <img
                    src={userSelected.picture}
                    alt={userSelected.nickname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-lg font-semibold">
                    {userSelected.nickname.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-lg min-w-max">{userSelected.nickname}</div>
            </div>
          </div>

          <div className="flex flex-col gap-2 overflow-y-scroll h-[500px] px-2 py-4">
            {chatHistory.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`max-w-[70%] px-4 py-2 rounded-xl ${
                  msg.sender === me._id
                    ? 'self-end bg-blue-500 text-white'
                    : 'self-start bg-gray-300 text-black'
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          <form className="flex gap-4 p-4" onSubmit={sendmsg}>
            <div className="flex rounded-2xl w-11/12 justify-between items-center bg-white/10 py-2 px-4">
              <input
                type="text"
                name="message"
                value={message}
                onChange={handleChange}
                placeholder="Send a message..."
                className="bg-transparent outline-none w-full"
              />
              <img src={gallery_icon} alt="gallery" />
            </div>
            <button type="submit">
              <img src={send_button} alt="send" />
            </button>
          </form>
        </div>
       ))
}
    </>
  );
}

export default Chat;


