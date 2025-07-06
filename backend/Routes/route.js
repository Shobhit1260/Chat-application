const express= require("express");
const { createGroup, addMember, storeUser } = require("../Controllers/controller");
const router=express.Router();

router.post('/creategroup',createGroup);
router.post('/addmember',addMember);
router.post('/storeuser',storeUser);




module.exports=router;