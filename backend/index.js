const express= require("express");
const mongoose=require("mongoose");
const app=express();
const dotenv=require("dotenv");
const http = require("http");
const cors = require("cors");
const { Server } = require('socket.io');
const path = require("path");
const User = require("./Models/userSchema");
const Group= require('./Models/groupSchema');
const routes=require('./Routes/route')
const cookieParser=require('cookie-parser')
const Message=require("./Models/messageSchema");
const { Socket } = require("net");


dotenv.config();
const port=process.env.PORT||4000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/v1',routes);



const server =http.createServer(app);
const io = new Server(server,{
    cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Map();

io.on('connection',(socket)=>{
   const userId = socket.handshake.auth.userId;
   console.log(userId, "connected");
   if (userId) {
    if(!onlineUsers.has(userId)){
      onlineUsers.set(userId,[]);
    }
    onlineUsers.get(userId).push(socket.id);
  
    io.emit('online-users', Array.from(onlineUsers.keys()));
  }

  socket.on('setup', async (userId) => { 
    //  for 1-1 chat
    socket.join(userId);
    // for group-chat 
    const user = await User.findById(userId).populate('groups');
    user?.groups.forEach(group => {
        socket.join(group._id.toString())
        console.log(group._id);
    })
    });


   socket.on("sendPrivateMessage",async({toUserId,message,fromUserId})=>{
    try{
       const savedMessage=await Message.create({
        sender:fromUserId,
        receiver:toUserId,
        receiverModel:"User",
        message,
        isRead:false,
        
       })
      const sockets=onlineUsers.get(toUserId);
      sockets.forEach((socket)=>{
        io.to(socket).emit("receivedPrivateMessage",savedMessage);
      }) 
      

      }
      catch(error){
       console.log("error",error);
       socket.on('disconnect', () => {
      console.log(' Disconnected:', socket.id);
      })
   }

   socket.on("sendGroupMessage",async({toGroupId,message,fromUserId})=>{
    try{
       const savedMessage=await Message.create({
        sender:fromUserId,
        receiver:toGroupId,
        receiverModel:"Group",
        message,
        isRead:false
       })
       io.to(toGroupId).emit("receivedGroupMessage",savedMessage);
      }
      catch(error){
       console.log("error",error);
      }
  })
  socket.on('disconnect', () => {
    const sockets=onlineUsers.get(userId);
    sockets.filter((id) => id !== socket.id) ;
      if(sockets.length===0)
       onlineUsers.delete(userId);
      else
       onlineUsers.set(userId,sockets);
      
    });
    io.emit('online-users', Array.from(onlineUsers.keys())); 
  });
   })  


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("dataBase connected successfully.");
})

server.listen(port,()=>{
    console.log(`server is running on port no :${port}`);
})





