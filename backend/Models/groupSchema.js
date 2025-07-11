const mongoose=require('mongoose');
const groupSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    profile:{
        type: String,
       required: false,
    },
    description:{
        type:String,
        required:false,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]  
})

module.exports = mongoose.model('group', groupSchema);