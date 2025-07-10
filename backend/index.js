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


io.on('connection',(socket)=>{
  console.log("socket connected",socket.id);
  socket.on('setup', async (userId) => {
     socket.userId = userId;
    //  for 1-1 chat
     socket.join(userId);
    // for group-chat 
    const user = await User.findById(userId).populate('groups');
    user?.groups.forEach(group => {
        socket.join(group._id.toString())
        console.log(group._id);
    })
  })

   socket.on("sendPrivateMessage",({toUserId,message})=>{
      io.to(toUserId).emit("receivePrivateMessage",{
        sender: socket.userId,
        receiver: toUserId,
        message,
        type: 'private',
        timestamp: Date.now(),
      })
   })
  
    socket.on("sendGroupMessage",({groupId,message})=>{
      io.to(groupId).emit("receiveGroupMessage",{
        sender: socket.userId,
        receiver:groupId,
        message,
        type: 'group',
        timestamp: Date.now(),
      })
   })

   socket.on('disconnect', () => {
    console.log(' Disconnected:', socket.id);
  });

})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("dataBase connected successfully.");
})

server.listen(port,()=>{
    console.log(`server is running on port no :${port}`);
})





