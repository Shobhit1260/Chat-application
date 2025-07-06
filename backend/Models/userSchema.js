const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    nickname:{
        type:String,
    },
    email:{
        type:String,
    },
    groups:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'group'
    }],
    picture:{
        type:String
    },
    sub:{
        type:String,
    }

})

module.exports = mongoose.model('user', userSchema);