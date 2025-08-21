const User=require('../Models/userSchema.js');
const Group=require('../Models/groupSchema');
const Message=require('../Models/messageSchema');

exports.fetchUser=async(req,res)=>{
   try{  
      const users= await User.find({});
      return res.status(200).json({
        success:true,
        users
      }) 
   }
   catch(error){
     console.log("error",error);
     res.status(500).json({
      message:"Internal Server Error"
     })
   }
}

exports.createGroup = async (req, res) => {
  try {
    const { nickname, membersId } = req.body;

    if (!nickname) {
      return res.status(400).json({
        success: false,
        message: "Please provide a group name.",
      });
    }

    if (membersId.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Please add at least two members to the group.",
      });
    }
  

    const currentUser = await User.findOne({ oauthId: req.user.sub });
    console.log("currentUser:", currentUser);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found.",
      });
    }

    const group = await Group.create({
      nickname,
      members: [...membersId, currentUser], 
      createdBy: currentUser._id,
    });

    await User.updateMany(
      { _id: { $in: [...membersId, currentUser._id] } },
      { $push: { groups: group._id } }
    );

    res.status(201).json({
      success: true,
      group,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};


exports.addMember=async(req,res)=>{
  try{
    const {groupId,memberId}= req.body;
    if(!groupId){
        return res.status(400).json({
            success:false,
            message:"select the group."
        });
    }
    if(!memberId){
        return res.status(400).json({
            success:false,
            message:"provide the member."
        })
    }
    const flag = await Group.findOne({ members: memberId });
    if(flag){
      return res.status(400).json({
        message:"member is already present."
      })
    }
    await Group.updateOne(
        { _id: groupId },
        { $push: { members: memberId } }
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
    const {nickname,email,picture,sub}=req.body;
    let user = await User.findOne({ oauthId: sub });

  if (!user) {
    user = await User.create({
      email,
      nickname,
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

exports.fetchchatHistory=async(req,res)=>{
  try{
    const {id1,id2}=req.params;
    const messages=await Message.find({
      $or:[
        { sender: id1, receiver: id2 },
        { sender: id2, receiver: id1 }
      ],
      receiverModel: "User"
    })
    .populate("sender").sort({ createdAt: 1 });
    res.status(200).json({
      success:true,
      messages
    });
  }
  catch(error){
    res.status(500).json({
      message:"Internal Server Error."
    })
  }
}

exports.fetchGroupChatHistory=async(req,res)=>{
  try{
    const{groupId}=req.params;
    const messages=await Message.find({
      receiver: groupId,
      receiverModel: "Group"
    }).
    populate('sender').
    sort({createdAt:1});
    res.status(200).json({
      success:true,
      messages
    })
  }
  catch(error){
    console.log("Error fetching group chat history:", error);
    res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}
exports.getallUsers=async(req,res)=>{
  try{
    const users=await User.find({});
    res.status(200).json({
      success:true,
      users
    });
  }
  catch(error){
    console.log("Error fetching all users:", error.message);
    res.status(500).json({
      message: "Internal Server Error."
    });
  }
}

exports.getallGroups=async(req,res)=>{
  try{
    const groups=await Group.find({});
    res.status(200).json({
      success:true,
      groups
    })
  }
  catch(error){
   console.log("Error fetching all groups:", error.message);
    res.status(500).json({
      message: "Internal Server Error."
    });
  }
}



