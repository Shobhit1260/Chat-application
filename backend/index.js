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
const Message=require("./Models/messageSchema")


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
  console.log('New client connected:', socket.id);
  const userId = socket.handshake.query.userId;
  console.log("userId:",userId);
   if (userId) {
    onlineUsers.set(userId, socket.id);
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
  })

   socket.on("sendPrivateMessage",async({toUserId,message,fromUserId})=>{
    try{
       const savedMessage=await Message.create({
        sender:fromUserId,
        receiver:toUserId,
        receiverModel:"User",
        message,
        date:Date.now(),
       })
       io.to(toUserId).emit("receivedPrivateMessage",savedMessage);
      }
      catch(error){
       console.log("error",error);
       socket.on('disconnect', () => {
      console.log(' Disconnected:', socket.id);
      })
   }
  })
  socket.on('disconnect', () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
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





