const User= require('../Models/userSchema');
const Group=require('../Models/groupSchema');
const groupSchema = require('../Models/groupSchema');

exports.createGroup=async(req,res)=>{
   try{
      
      const {name,membersId}=req.body;
      if(!name){
        return res.status(400).json({
           success:false,
           message:"plz provide name to the group." 
        })
      }
      if(!membersId){
        return res.status(400).json({
           success:false,
           message:"plz add at least two members to the group." 
        })
      }
      
      const group= await Group.create({
        name,
        members:[...membersId,req.user.Id]
      })
      
      await User.updateMany(
        {_id:{$in:[...membersId,req.user.Id]}},
        {$push:{groups:group._id}}
      )
     
     console.log("hello in create group")
      res.status(201).json({
        success:true,
        group
      })
   }
   catch(err){
     res.status(500).json({
        messsage:"internal server error."
     })
   }
}

exports.addMember=async(req,res)=>{
  try{
    const {groupId,memberId}= req.body;
    if(!groupId){
        return res.status(400).json({
            success:false,
            message:"select the group."
        })
    }
    if(!memberId){
        return res.status(400).json({
            success:false,
            message:"provide the member."
        })
    }
    await Group.updateOne(
        { _id: groupId },
        { $push: { member: memberId } }
    )

    await User.updateOne(
        { _id: memberId },
        { $push: { groups: groupId } }
    )

    res.status(200).json({ message: 'User added to group' });

  }
  catch(error){
    res.status(500).json({
      message:"internal server error."
    })

  }
}

exports.storeUser=async(req,res)=>{
  try{
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
       const token =req.headers.authorization.split(" ")[1];
        console.log("Hello from this side:",token)
        res.cookie("auth0_token", token, {
        httpOnly: true,
        secure: false,         
        sameSite: "none",     
        maxAge: 24 * 60 * 60 * 1000 
    });
  }

    const {nickname,email,picture,sub}=req.body;
      let user = await User.findOne({ oauthId: sub });

  if (!user) {
    user = await User.create({
      email,
      username: nickname,
      picture,
      oauthId: sub,
      oauthProvider: "auth0",
    });
  }
    res.status(201).json({
      success:true,
      user
    })
  }
  catch(error){
    console.error("Error storing user:", error.message);
    res.status(500).json({
      message:"Internal Server Error."
    })
  }

}

